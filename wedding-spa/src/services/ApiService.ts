// ApiService.ts

import { getImageDimensions } from "./utils";
import { Rsvp } from "../types/rsvp";            // your Rsvp/Guest interfaces
import { ImageMetadata } from "../types/gallery";
import {AddGuestDTO, CreateRsvpDTO, LookupDTO, WeddingGuest} from "../types/RsvpDTO";

/**
 * A standardized response type for all API calls:
 * - success: indicates if the request was successful
 * - data?: payload if success is true
 * - error?: error message if success is false
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export const API_URL = "https://api.kevinlovesolivia.com";

/**
 * A generic request function returning ApiResponse<T>.
 * It handles fetch, checks response.ok, and parses JSON if present.
 */
async function request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);

        // 1. If response not OK, parse an error
        if (!response.ok) {
            let errorMessage = "An unknown error occurred";
            try {
                const errorData = await response.json();
                // Adjust if your server uses a different field for errors
                errorMessage = errorData?.detail || errorData?.message || errorMessage;
            } catch {
                // If we can't parse JSON, keep default errorMessage
            }
            return { success: false, error: errorMessage };
        }

        // 2. If 204 or no content, just return success
        if (response.status === 204) {
            return { success: true };
        }

        // 3. Parse response text
        const text = await response.text();
        if (!text) {
            return { success: true };
        }

        const data: T = JSON.parse(text);
        return { success: true, data };
    } catch (error: unknown) {
        // 4. Network or fetch-level error
        console.error("API Request Error:", error);
        if (error instanceof Error) {
            return {success: false, error: error.message || "Request failed"};
        }
        return {success: false, error: "Request failed"};
    }
}

/** Admin login. Returns { token: string, expiresIn: number } or similar. */
export async function adminLogin(
    username: string,
    password: string
): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
    return request<{ token: string; expiresIn: number }>("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    });
}

/** Verify a token. Returns a boolean in `data`. */
export async function verifyToken(authToken: string): Promise<ApiResponse<boolean>> {
    return request<boolean>("/auth/verify-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
}

/** =======================
 RSVP-related methods
 ======================= */

/**
 * Create a new RSVP by calling POST /rsvp/create.
 * Backend expects a CreateRsvpDTO. Returns { message, rsvp_id } in data,
 * so if you need the full Rsvp object, either retrieve it again or adapt as needed.
 */
export async function createRsvp(rsvpData: CreateRsvpDTO): Promise<ApiResponse<Rsvp>> {
    return request<Rsvp>("/rsvp/create", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(rsvpData),
    });
}

/**
 * Edit an existing RSVP by calling PUT /rsvp/edit.
 * The backend expects the full Rsvp object in the body, returns {message}.
 */
export async function editRsvp(rsvp: Rsvp): Promise<ApiResponse<Rsvp>> {
    return request<Rsvp>("/rsvp/edit", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(rsvp),
    });
}

/**
 * Submit the RSVP by calling POST /rsvp/submit.
 * This sets restricted fields on the backend. Returns {message}.
 */
export async function submitRsvp(rsvp: Rsvp): Promise<ApiResponse<{message: string}>> {
    return request<{message: string}>("/rsvp/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(rsvp),
    });
}

/**
 * Lookup an RSVP(s) by calling POST /rsvp/lookup.
 * The backend returns List<Rsvp>, so data will be Rsvp[].
 */
export async function lookupRsvp(dto: LookupDTO): Promise<ApiResponse<Rsvp[]>> {
    return request<Rsvp[]>("/rsvp/lookup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(dto),
    });
}

/**
 * Delete an RSVP by calling DELETE /rsvp/delete?rsvpId=xxx.
 * Returns {message} on success.
 */
export async function deleteRsvpRequest(rsvpId: string): Promise<ApiResponse<{message: string}>> {
    const params = new URLSearchParams({ rsvpId });
    return request<{message: string}>(`/rsvp/delete?${params.toString()}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
}

/**
 * Get all RSVPs by calling GET /rsvp/all.
 * Returns Rsvp[] in data.
 */
export async function getRsvps(): Promise<ApiResponse<Rsvp[]>> {
    return request<Rsvp[]>("/rsvp/all", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        credentials: "include",
    });
}

/**
 * Add a guest to an existing RSVP: POST /rsvp/guest/add
 * Body: { first_name, last_name, rsvp_id }
 * Returns {message}.
 */
export async function addGuestToRsvp(guestDto: AddGuestDTO): Promise<ApiResponse<{message: string}>> {
    return request<{message: string}>("/rsvp/guest/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(guestDto),
    });
}

/**
 * Remove a guest from an existing RSVP: POST /rsvp/guest/remove
 * Body: { first_name, last_name, rsvp_id }
 * Returns {message}.
 */
export async function removeGuestFromRsvp(guestDto: AddGuestDTO): Promise<ApiResponse<{message: string}>> {
    return request<{message: string}>("/rsvp/guest/remove", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(guestDto),
    });
}

/**
 * Get all wedding guests: GET /rsvp/guest/all
 * Returns WeddingGuest[] in data.
 */
export async function getAllRsvpGuests(): Promise<ApiResponse<WeddingGuest[]>> {
    return request<WeddingGuest[]>("/rsvp/guest/all", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        credentials: "include",
    });
}

/** ============================
 GALLERY-related methods
 ============================ */

/**
 * Upload a photo:
 * 1. Get image dimensions
 * 2. Generate presigned URL
 * 3. PUT to S3
 * 4. Save metadata on your server
 * Returns the new ImageMetadata with final info
 */
export async function uploadPhoto(file: File): Promise<ApiResponse<ImageMetadata>> {
    // 1. Get the image dimensions from the file
    const { width, height } = await getImageDimensions(file);

    // 2. Request a pre-signed URL
    const presigned = await request<{ url: string; key: string }>(
        "/gallery/generate-presigned-url",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileName: file.name }),
        }
    );

    if (!presigned.success || !presigned.data) {
        return { success: false, error: presigned.error ?? "Failed to generate presigned URL" };
    }

    const { url, key } = presigned.data;

    // 3. Upload directly to S3
    const s3Response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });
    if (!s3Response.ok) {
        return { success: false, error: `S3 upload failed for ${file.name}` };
    }

    // 4. Remove query params to get the final image URL
    const imageUrl = url.split("?")[0];

    // 5. Save metadata in your backend
    const metadataPayload = {
        imageId: key,
        imageUrl,
        width,
        height,
    };

    return request<ImageMetadata>("/gallery/metadata", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(metadataPayload),
    });
}

/** Get all photo metadata. Returns an array of ImageMetadata. */
export async function getPhotoMetadata(): Promise<ApiResponse<ImageMetadata[]>> {
    return request<ImageMetadata[]>("/gallery/all", {
        method: "GET",
        headers: {},
        credentials: "include",
    });
}

/** Change the order of images. Returns no data (null). */
export async function postChangeImageOrder(
    movingImageId: string,
    previousImageId: string | null,
    followingImageId: string | null
): Promise<ApiResponse<null>> {
    return request<null>("/gallery/change-image-order", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            movingImageId,
            previousImageId,
            followingImageId,
        }),
    });
}

/** Delete an image by ID. Returns no data (null). */
export async function deleteImageRequest(imageId: string): Promise<ApiResponse<null>> {
    return request<null>(`/gallery/delete`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ imageId }),
    });
}
