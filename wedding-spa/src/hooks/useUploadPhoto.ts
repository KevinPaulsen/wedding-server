import { useState } from 'react';
import { uploadPhoto } from '../services/ApiService';

export const useUploadPhoto = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const upload = async (file: File): Promise<any> => {
        setLoading(true);
        setError(null);
        try {
            const response = await uploadPhoto(file);
            setLoading(false);
            return response;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    return { upload, loading, error };
};
