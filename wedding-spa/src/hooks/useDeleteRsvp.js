import {useState} from 'react';
import {API_URL} from '../config';

export const useDeleteRsvp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteRsvp = async (rsvpCode) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/rsvp/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(rsvpCode),
            });

            if (!response.ok) {
                throw new Error('Failed to delete RSVP');
            }

            setLoading(false);
            return await response.json();
        } catch (error) {
            setLoading(false);
            setError(error);
            console.error('Error deleting RSVP:', error);
            throw error;
        }
    };

    return {deleteRsvp, loading, error};
};
