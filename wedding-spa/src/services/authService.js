import {API_URL} from "../config";

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({username, password}),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || 'Login failed');
    }

    return await response.json();
};