// hooks/rsvp/usePutRsvp.ts
import { useApi } from '../useApi';
import { updateRsvp } from '../../services/ApiService';
import { Rsvp } from '../../types/rsvp';

/**
 * Wraps updateRsvp, returning ApiResponse<Rsvp>.
 */
export function usePutRsvp() {
    // T = Rsvp, A = [Partial<Rsvp>]
    return useApi<Rsvp, [Partial<Rsvp>]>(updateRsvp);
}
