import {useState} from 'react';
import {createRsvp, getRsvpRequest} from "../services/ApiService";

export const useGetRsvp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getRsvp = async (rsvpCode, lastname) => {
        setLoading(true);
        setError(null);
        let rsvp = null;

        try {
            rsvp = await getRsvpRequest(rsvpCode, lastname);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

        return rsvp;
    };

    return {getRsvp, loading, error};
};
