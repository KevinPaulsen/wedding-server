import { useState } from 'react';
import { postChangeImageOrder } from "../services/ApiService";

export const useChangeImageOrder = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const changeImageOrder = async (
        movingImageId: string,
        previousImageId: string,
        followingImageId: string
    ): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await postChangeImageOrder(movingImageId, previousImageId, followingImageId);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { changeImageOrder, loading, error };
};
