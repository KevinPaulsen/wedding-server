// hooks/rsvp/useDeleteRsvp.ts
import { useApi } from '../useApi';
import { deleteRsvpRequest } from '../../services/ApiService';

/**
 * This hook simply wraps deleteRsvpRequest, which returns ApiResponse<null>.
 */
export function useDeleteRsvp() {
    // `deleteRsvpRequest` expects a `string` argument (the rsvpCode).
    // We specify T = null, A = [string].
    return useApi<null, [string]>(deleteRsvpRequest);
}
