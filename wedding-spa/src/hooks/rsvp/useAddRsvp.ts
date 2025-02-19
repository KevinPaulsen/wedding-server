// hooks/rsvp/useAddRsvp.ts
import { useApi } from '../useApi';
import { createRsvp } from '../../services/ApiService';
import { Rsvp } from '../../types/rsvp';

/**
 * Wraps `createRsvp` in a specialized hook that returns a typed `execute` method,
 * plus `loading`, `error`, and (optionally) the newly created Rsvp.
 */
export function useAddRsvp() {
    // If `createRsvp` expects `Partial<Rsvp>` as argument and returns `ApiResponse<Rsvp>`
    // the second generic param [Partial<Rsvp>] describes the arguments to `execute()`.
    return useApi<Rsvp, [Partial<Rsvp>]>(createRsvp);
}
