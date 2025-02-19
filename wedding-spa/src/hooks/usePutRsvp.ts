import { useState } from 'react';
import { updateRsvp } from "../services/ApiService";

export const usePutRsvp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const putRsvp = async (rsvpData: any): Promise<any> => {
        setLoading(true);
        setError('');
        let data: any = null;
        try {
            data = await updateRsvp(rsvpData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        return data;
    };

    return { putRsvp, loading, error };
};
