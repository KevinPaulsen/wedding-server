// hooks/rsvp/useEditRsvp.ts
import { useApi } from '../useApi';
import { editRsvp } from '../../services/ApiService';
import { Rsvp } from '../../types/rsvp';

export function useEditRsvp() {
    // T = { message: string }, A = [Rsvp]
    return useApi<Rsvp, [Rsvp]>(editRsvp);
}
