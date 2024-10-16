export const API_URL = 'https://api.KevinLovesOlivia.com';

const request = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.detail || 'An unknown error occurred';
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

export const createRsvp = (rsvpData) => {
    return request('/rsvp/create', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(rsvpData),
    });
}

export const deleteRsvpRequest = (rsvpCode) => {
    return request('/rsvp/delete', {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(rsvpCode),
    });
}

export const updateRsvp = (updateData) => {
    console.log(updateData);
    return request('/rsvp/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
    });
};

export const verifyToken = (authToken) => {
    return request('/auth/verify-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });
}

export const getRsvpRequest = (rsvpCode, lastname) => {
    const params = new URLSearchParams({ rsvpCode, lastname });

    return request(`/rsvp/get?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
}

export const getRsvps = () => {
    return request('/rsvp/all', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        },
        credentials: 'include',
    });
}

export const adminLogin = (username, password) => {
    return request('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({username, password}),
    });
}
