// hooks/auth/useAdminLogin.ts
import {useApi} from "../useApi";
import {adminLogin} from "../../services/ApiService";

/**
 * useAdminLogin wraps the adminLogin API call.
 * It returns an object with { data, error, loading, execute }.
 *
 * Expected API return: { token: string; expiresIn: number }
 */
export function useAdminLogin() {
  return useApi<{ token: string; expiresIn: number }, [string, string]>(adminLogin);
}
