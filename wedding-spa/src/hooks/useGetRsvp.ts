import { useState } from 'react';
import { getRsvpRequest } from "../services/ApiService";

export const useGetRsvp = () => {
    const [rsvp, setRsvp] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const getRsvp = async (rsvpCode: string, lastname: string): Promise<any> => {
        setLoading(true);
        setError('');
        try {
            const result = await getRsvpRequest(rsvpCode, lastname);
            setRsvp(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        return rsvp;
    };

    return { getRsvp, rsvp, loading, error };
};
