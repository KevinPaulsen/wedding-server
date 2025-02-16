// useUploadPhoto.js
import { useState } from 'react';
import { uploadPhoto } from '../services/ApiService';

export const useUploadPhoto = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const upload = async (file) => {
        setLoading(true);
        setError(null);
        try {
            const response = await uploadPhoto(file);
            setLoading(false);
            return response;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    return { upload, loading, error };
};
