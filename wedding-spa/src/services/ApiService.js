import {getImageDimensions} from './utils';

export const API_URL = 'https://api.KevinLovesOlivia.com';

const request = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            let errorMessage = 'An unknown error occurred';
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorMessage;
            } catch (jsonError) {
                console.error('Error parsing error response JSON:', jsonError);
            }
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return;
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

export const createRsvp = (rsvpData) => {
    return request('/rsvp/create', {
        method: 'POST', headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`, 'Content-Type': 'application/json',
        }, credentials: 'include', body: JSON.stringify(rsvpData),
    });
}

export const deleteRsvpRequest = (rsvpCode) => {
    const params = new URLSearchParams({rsvpCode});

    return request(`/rsvp/delete?${params}`, {
        method: 'DELETE', headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`, 'Content-Type': 'application/json',
        }, credentials: 'include',
    });
}

export const updateRsvp = (updateData) => {
    return request('/rsvp/update', {
        method: 'PUT', headers: {
            'Content-Type': 'application/json',
        }, credentials: 'include', body: JSON.stringify(updateData),
    });
};

export const verifyToken = (authToken) => {
    return request('/auth/verify-token', {
        method: 'POST', headers: {
            'Content-Type': 'application/json', Authorization: `Bearer ${authToken}`,
        },
    });
}

export const getRsvpRequest = (rsvpCode, lastname) => {
    const params = new URLSearchParams({rsvpCode, lastname});

    return request(`/rsvp/get?${params.toString()}`, {
        method: 'GET', headers: {
            'Content-Type': 'application/json',
        }, credentials: 'include',
    });
}

export const getRsvps = () => {
    return request('/rsvp/all', {
        method: 'GET', headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        }, credentials: 'include',
    });
}

export const adminLogin = (username, password) => {
    return request('/auth/login', {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, credentials: 'include', body: JSON.stringify({username, password}),
    });
}

export const uploadPhoto = async (file) => {
    // 1. Get the image dimensions from the file
    const { width, height } = await getImageDimensions(file);

    // 2. Request a pre-signed URL from your backend
    const presignedResponse = await request('/gallery/generate-presigned-url', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName: file.name }),
    });

    const { url, key } = presignedResponse;

    // 3. Upload the file directly to S3 using the pre-signed URL
    const s3Response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });

    if (!s3Response.ok) {
        throw new Error(`S3 upload failed for ${file.name}`);
    }

    // 4. Save metadata in your backend
    // We remove any query parameters from the URL to get the actual public URL (if applicable)
    const imageUrl = url.split('?')[0];
    const metadataPayload = {
        imageId: key,
        imageUrl,
        width,
        height,
    };

    // 5. Save metadata in your backend
    return await request('/gallery/metadata', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadataPayload),
    });
};

export const getPhotoMetadata = () => {
    return request('/gallery/all', {
        method: 'GET', headers: {
        }, credentials: 'include',
    });
}
