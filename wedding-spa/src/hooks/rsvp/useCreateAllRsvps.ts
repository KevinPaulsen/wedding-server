// hooks/rsvp/useCreateAllRsvps.ts
import { useApi } from '../useApi';
import { createAllRsvps } from '../../services/ApiService';

export function useCreateAllRsvps() {
  return useApi<string, [File]>(createAllRsvps);
}
