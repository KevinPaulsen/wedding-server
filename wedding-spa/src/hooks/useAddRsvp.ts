import { useState } from 'react';
import { createRsvp } from "../services/ApiService";

export const useAddRsvp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addRsvp = async (rsvpData: any): Promise<any> => {
        setLoading(true);
        setError(null);
        let data: any = null;
        try {
            data = await createRsvp(rsvpData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        return data;
    };

    return { addRsvp, loading, error };
};
