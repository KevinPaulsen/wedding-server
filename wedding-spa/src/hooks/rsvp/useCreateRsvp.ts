// hooks/rsvp/useCreateRsvp.ts
import { useApi } from '../useApi';
import { createRsvp } from '../../services/ApiService';
import {CreateRsvpDTO} from "../../types/RsvpDTO";

export function useCreateRsvp() {
    // T = { message: string; rsvp_id: string }, A = [CreateRsvpDTO]
    return useApi<{ message: string; rsvp_id: string }, [CreateRsvpDTO]>(createRsvp);
}
