// hooks/rsvp/useRsvpData.ts
import { useApi } from '../useApi';
import { getRsvps } from '../../services/ApiService';
import { useEffect, useState } from 'react';
import { Rsvp } from '../../types/rsvp';

/**
 * A specialized hook that:
 * 1) Uses `useApi` for fetching all RSVPs
 * 2) Syncs the returned data into local state so we can do removeRsvp
 */
export function useRsvpData() {
    const { data, error, loading, execute } = useApi<Rsvp[], []>(getRsvps);
    const [localData, setLocalData] = useState<Rsvp[]>([]);

    // Fetch once on mount
    useEffect(() => {
        (async () => {
            await execute(); // calls getRsvps
        })();
        // we don't include `execute` in dependencies if we only want to run once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync API's `data` into localData whenever it changes
    useEffect(() => {
        if (data) {
            setLocalData(data);
        }
    }, [data]);

    // local helper to remove one RSVP from local state
    const removeRsvp = (rsvpCode: string) => {
        setLocalData(prev => prev.filter(r => r.rsvpCode !== rsvpCode));
    };

    return { data: localData, loading, error, removeRsvp };
}
