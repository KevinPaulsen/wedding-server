import {useState} from 'react';
import {deleteRsvpRequest} from "../services/ApiService";

export const useDeleteRsvp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteRsvp = async (rsvpCode) => {
        setLoading(true);
        setError(null);
        let response = null;

        try {
            response = await deleteRsvpRequest(rsvpCode);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

        return response;
    };

    return {deleteRsvp, loading, error};
};
