import { useState, useEffect } from 'react';
import { API_URL } from '../config';

const useRsvpData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchRsvpData = async () => {
            try {
                const response = await fetch(`${API_URL}/rsvp/rsvps`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (isMounted) {
                    setData(result);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchRsvpData();

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, loading, error };
};

export default useRsvpData;
