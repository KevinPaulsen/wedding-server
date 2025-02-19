import { useState } from 'react';
import { deleteImageRequest } from "../services/ApiService";

export const useDeleteImage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteImage = async (imageId: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await deleteImageRequest(imageId);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteImage, loading, error };
};
