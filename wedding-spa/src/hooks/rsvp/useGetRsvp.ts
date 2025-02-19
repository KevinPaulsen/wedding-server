// hooks/rsvp/useGetRsvp.ts
import { useApi } from '../useApi';
import { getRsvpRequest } from '../../services/ApiService';
import { Rsvp } from '../../types/rsvp';

/**
 * Wraps getRsvpRequest(rsvpCode, lastname), returning ApiResponse<Rsvp>.
 */
export function useGetRsvp() {
    // T = Rsvp, A = [string, string] for (rsvpCode, lastname)
    return useApi<Rsvp, [string, string]>(getRsvpRequest);
}
