// hooks/rsvp/useCreateRsvp.ts
import {useApi} from '../useApi';
import {createRsvp} from '../../services/ApiService';
import {CreateRsvpDTO} from "../../types/RsvpDTO";
import {Rsvp} from "../../types/rsvp";

export function useCreateRsvp() {
  return useApi<Rsvp, [CreateRsvpDTO]>(createRsvp);
}
