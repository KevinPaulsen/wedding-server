// hooks/useApi.ts
import {useCallback, useState} from 'react';
import {ApiResponse} from '../services/ApiService';

/**
 * A reusable generic hook for any API call returning ApiResponse<T>.
 *
 * @template T   The data type returned on success (e.g. Rsvp, Rsvp[], etc.)
 * @template A   A tuple for the function args (e.g. [string], [Partial<Rsvp>], etc.)
 */
export function useApi<T, A extends unknown[]>(
    serviceFn: (...args: A) => Promise<ApiResponse<T>>
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(async (...args: A): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await serviceFn(...args);
      if (!response.success) {
        setError(response.error ?? 'API request failed');
      } else {
        setData(response.data ?? null);
      }
      return response;
    } catch (e: unknown) {
      const errMsg =
          e instanceof Error ? e.message || 'Unexpected error occurred' : 'Unexpected error occurred';
      setError(errMsg);
      return {success: false, error: errMsg, data: null} as ApiResponse<T>;
    } finally {
      setLoading(false);
    }
  }, [serviceFn]);

  return {data, error, loading, execute};
}
