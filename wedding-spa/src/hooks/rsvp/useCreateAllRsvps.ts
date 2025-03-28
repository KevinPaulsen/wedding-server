// hooks/rsvp/useCreateAllRsvps.ts
import { useApi } from '../useApi';
import { createAllRsvps } from '../../services/ApiService';
import {Rsvp} from "../../types/rsvp";

export function useCreateAllRsvps() {
  return useApi<Rsvp[], [File]>(createAllRsvps);
}
