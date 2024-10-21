import {useState} from 'react';
import {getRsvpRequest} from "../services/ApiService";

export const useGetRsvp = () => {
    const [rsvp, setRsvp] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getRsvp = async (rsvpCode, lastname) => {
        setLoading(true);
        setError('');

        try {
            setRsvp(await getRsvpRequest(rsvpCode, lastname));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

        return rsvp;
    };

    return {getRsvp, rsvp, loading, error};
};
