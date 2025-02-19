import { useState } from 'react';
import { deleteRsvpRequest } from "../services/ApiService";

export const useDeleteRsvp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const deleteRsvp = async (rsvpCode: string): Promise<void> => {
        setLoading(true);
        setDeleteError(null);
        try {
            await deleteRsvpRequest(rsvpCode);
        } catch (err: any) {
            setDeleteError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteRsvp, loading, deleteError };
};
