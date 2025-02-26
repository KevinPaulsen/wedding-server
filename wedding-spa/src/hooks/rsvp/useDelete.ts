// hooks/rsvp/useCreateRsvp.ts
import {useApi} from '../useApi';
import {deleteRsvpRequest} from '../../services/ApiService';

export function useDeleteRsvp() {
    // T = { message: string; rsvp_id: string }, A = [CreateRsvpDTO]
    return useApi<{ message: string; }, [rsvpId: string]>(deleteRsvpRequest);
}
