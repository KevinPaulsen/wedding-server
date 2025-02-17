// useChangeImageOrder.js
import {useState} from 'react';
import {postChangeImageOrder} from "../services/ApiService";

export const useChangeImageOrder = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const changeImageOrder = async (movingImageId, previousImageId, followingImageId) => {
        setLoading(true);
        setError(null);

        try {
            await postChangeImageOrder(movingImageId, previousImageId, followingImageId);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {changeImageOrder, loading, error};
};
