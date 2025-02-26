// hooks/rsvp/useGetAllRsvpGuests.ts
import { useApi } from '../useApi';
import { getAllRsvpGuests } from '../../services/ApiService';
import {WeddingGuest} from "../../types/RsvpDTO";

export function useGetAllRsvpGuests() {
    return useApi<WeddingGuest[], []>(getAllRsvpGuests);
}
