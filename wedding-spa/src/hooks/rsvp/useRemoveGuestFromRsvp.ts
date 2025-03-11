// hooks/rsvp/useRemoveGuestFromRsvp.ts
import {useApi} from '../useApi';
import {removeGuestFromRsvp} from '../../services/ApiService';
import {AddGuestDTO} from "../../types/RsvpDTO";

export function useRemoveGuestFromRsvp() {
  return useApi<{ message: string }, [AddGuestDTO]>(removeGuestFromRsvp);
}
