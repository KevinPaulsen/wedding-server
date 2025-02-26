// hooks/rsvp/useAddGuestToRsvp.ts
import { useApi } from '../useApi';
import { addGuestToRsvp } from '../../services/ApiService';
import {AddGuestDTO} from "../../types/RsvpDTO";

export function useAddGuestToRsvp() {
    return useApi<{message: string}, [AddGuestDTO]>(addGuestToRsvp);
}
