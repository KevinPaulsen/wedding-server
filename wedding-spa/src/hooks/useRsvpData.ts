import { useEffect, useState } from 'react';
import { getRsvps } from "../services/ApiService";

export const useRsvpData = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchRsvpData = async () => {
            try {
                const rsvps = await getRsvps();
                if (isMounted) {
                    setData(rsvps);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRsvpData();

        return () => {
            isMounted = false;
        };
    }, []);

    const removeRsvp = (rsvpCode: string) => {
        setData(prevData => prevData.filter(rsvp => rsvp.rsvpCode !== rsvpCode));
    };

    return { removeRsvp, data, loading, error };
};

export default useRsvpData;
