// useAddRsvp.js
import {useState} from 'react';
import {createRsvp} from "../services/ApiService";

export const useAddRsvp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addRsvp = async (rsvpData) => {
        setLoading(true);
        setError(null);
        let data = null;

        try {
            data = await createRsvp(rsvpData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

        return data;
    };

    return {addRsvp, loading, error};
};
