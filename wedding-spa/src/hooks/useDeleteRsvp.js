import {useState} from 'react';
import {deleteRsvpRequest} from "../services/ApiService";

export const useDeleteRsvp = () => {
    const [loading, setLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const deleteRsvp = async (rsvpCode) => {
        setLoading(true);
        setDeleteError(null);

        try {
            await deleteRsvpRequest(rsvpCode);
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {deleteRsvp, loading, deleteError};
};
