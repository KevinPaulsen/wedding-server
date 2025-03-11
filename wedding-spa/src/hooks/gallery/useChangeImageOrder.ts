// hooks/gallery/useChangeImageOrder.ts
import {useApi} from '../useApi'; // adjust path as needed
import {postChangeImageOrder} from "../../services/ApiService";

export function useChangeImageOrder() {
  // T = null, A = [string, string | null, string | null]
  return useApi<null, [string, string | null, string | null]>(postChangeImageOrder);
}
