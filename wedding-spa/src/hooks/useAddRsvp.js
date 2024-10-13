import { useState } from 'react';
import { API_URL } from '../config';

export const useAddRsvp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addRsvp = async (rsvpData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/rsvp/addRsvp`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(rsvpData),
            });

            if (!response.ok) {
                throw new Error('Failed to add RSVP');
            }

            setLoading(false);
            return await response.json();
        } catch (error) {
            setLoading(false);
            setError(error);
            console.error('Error adding RSVP:', error);
            throw error;
        }
    };

    return { addRsvp, loading, error };
};
