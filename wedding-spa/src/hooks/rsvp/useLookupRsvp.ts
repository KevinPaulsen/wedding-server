// hooks/rsvp/useLookupRsvp.ts
import { useApi } from '../useApi';
import { lookupRsvp } from '../../services/ApiService';
import { Rsvp } from '../../types/rsvp';
import {LookupDTO} from "../../types/RsvpDTO";

export function useLookupRsvp() {
    return useApi<Rsvp[], [LookupDTO]>(lookupRsvp);
}
