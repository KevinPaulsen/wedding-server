import {useEffect, useState} from 'react';
import {getRsvps} from "../services/ApiService";

const useRsvpData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchRsvpData = async () => {
            try {
                const rsvps = await getRsvps();

                if (isMounted) {
                    setData(rsvps);
                }
            } catch (err) {
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

    return {data, loading, error};
};

export default useRsvpData;
