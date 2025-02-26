// hooks/rsvp/useSubmitRsvp.ts
import { useApi } from '../useApi';
import { submitRsvp } from '../../services/ApiService';
import { Rsvp } from '../../types/rsvp';

export function useSubmitRsvp() {
    return useApi<{message: string}, [Rsvp]>(submitRsvp);
}
