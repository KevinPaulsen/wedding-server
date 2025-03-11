// hooks/rsvp/useRsvpData.ts
import {useApi} from '../useApi';
import {getRsvps} from '../../services/ApiService';
import {useEffect, useState} from 'react';
import {Rsvp} from '../../types/rsvp';

/**
 * A specialized hook that:
 * 1) Uses `useApi` for fetching all RSVPs
 * 2) Syncs the returned data into local state so we can do removeRsvp
 */
export function useRsvpData() {
  const {data, error, loading, execute} = useApi<Rsvp[], []>(getRsvps);
  const [localData, setLocalData] = useState<Rsvp[]>([]);

  useEffect(() => {
    (async () => {
      await execute(); // calls getRsvps
    })();
  }, []);

  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  const addRsvp = (rsvp: Rsvp) => {
    setLocalData(prev => [...prev, rsvp]);
  }

  // Remove an RSVP by ID
  const removeRsvp = (rsvpCode: string) => {
    setLocalData(prev => prev.filter(r => r.rsvp_id !== rsvpCode));
  };

  // Update an existing RSVP by matching on rsvp_id
  const updateRsvpInState = (updatedRsvp: Rsvp) => {
    setLocalData((prev) =>
        prev.map((r) => (r.rsvp_id === updatedRsvp.rsvp_id ? updatedRsvp : r))
    );
  };

  return {
    data: localData,
    loading,
    error,
    removeRsvp,
    addRsvp,
    updateRsvpInState,
  };
}
