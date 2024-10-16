import {useState} from 'react';
import {updateRsvp} from "../services/ApiService";

export const usePutRsvp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const putRsvp = async (rsvpData) => {
        setLoading(true);
        setError(null);
        let data = null;

        try {
            data = await updateRsvp(rsvpData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

        return data;
    };

    return {putRsvp, loading, error};
};
