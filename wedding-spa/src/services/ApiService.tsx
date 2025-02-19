// ApiService.tsx
import { getImageDimensions } from "./utils";

export const API_URL: string = "https://api.KevinLovesOlivia.com";

// A generic request function that returns a Promise of type T
const request = async <T = any>(
                endpoint: string,
        options: RequestInit = {}
): Promise<T> => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);

        if (!response.ok) {
            let errorMessage = "An unknown error occurred";
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorMessage;
            } catch (jsonError) {
                console.error("Error parsing error response JSON:", jsonError);
            }
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return undefined as unknown as T;
        }

        return (await response.json()) as T;
    } catch (error) {
        console.error("API Request Error:", error);
        throw error;
    }
};

export const createRsvp = (rsvpData: any): Promise<any> => {
    return request<any>("/rsvp/create", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(rsvpData),
    });
};

export const deleteRsvpRequest = (rsvpCode: string): Promise<any> => {
    const params = new URLSearchParams({ rsvpCode });
    return request<any>(`/rsvp/delete?${params.toString()}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
};

export const updateRsvp = (updateData: any): Promise<any> => {
    return request<any>("/rsvp/update", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
    });
};

export const verifyToken = (authToken: string): Promise<any> => {
    return request<any>("/auth/verify-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
};

export const getRsvpRequest = (
                rsvpCode: string,
        lastname: string
): Promise<any> => {
    const params = new URLSearchParams({ rsvpCode, lastname });
    return request<any>(`/rsvp/get?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
};

export const getRsvps = (): Promise<any> => {
    return request<any>("/rsvp/all", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        credentials: "include",
    });
};

export const adminLogin = (
                username: string,
        password: string
): Promise<any> => {
    return request<any>("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    });
};

export const uploadPhoto = async (file: File): Promise<any> => {
    // 1. Get the image dimensions from the file
    const { width, height } = await getImageDimensions(file);

    // 2. Request a pre-signed URL from your backend
    const presignedResponse = await request<{
        url: string;
        key: string;
    }>("/gallery/generate-presigned-url", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: file.name }),
    });

    const { url, key } = presignedResponse;

    // 3. Upload the file directly to S3 using the pre-signed URL
    const s3Response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });

    if (!s3Response.ok) {
        throw new Error(`S3 upload failed for ${file.name}`);
    }

    // 4. Remove any query parameters from the URL to get the actual public URL (if applicable)
    const imageUrl = url.split("?")[0];
    const metadataPayload = {
        imageId: key,
        imageUrl,
        width,
        height,
    };

    // 5. Save metadata in your backend
    return await request<any>("/gallery/metadata", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(metadataPayload),
    });
};

export const getPhotoMetadata = (): Promise<any> => {
    return request<any>("/gallery/all", {
        method: "GET",
        headers: {},
        credentials: "include",
    });
};

export const postChangeImageOrder = (
                movingImageId: string,
        previousImageId: string,
        followingImageId: string
): Promise<any> => {
    return request<any>("/gallery/change-image-order", {
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
};

export const deleteImageRequest = (imageId: string): Promise<any> => {
    return request<any>(`/gallery/delete`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
                                 imageId,
                             }),
    });
};
