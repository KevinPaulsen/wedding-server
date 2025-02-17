import {useState} from 'react';
import {deleteImageRequest} from "../services/ApiService";

export const useDeleteImage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteImage = async (rsvpCode) => {
        setLoading(true);
        setError(null);

        try {
            await deleteImageRequest(rsvpCode);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {deleteImage, loading, error};
};
