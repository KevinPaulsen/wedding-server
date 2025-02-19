// hooks/useApi.ts
import { useState, useCallback } from 'react';
import { ApiResponse } from '../services/ApiService';

/**
 * A reusable generic hook for any API call returning ApiResponse<T>.
 *
 * @template T   The data type returned on success (e.g. Rsvp, Rsvp[], etc.)
 * @template A   A tuple for the function args (e.g. [string], [Partial<Rsvp>], etc.)
 */
export function useApi<T, A extends any[]>(
    serviceFn: (...args: A) => Promise<ApiResponse<T>>
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Wrap execute in useCallback so that it's memoized.
    const execute = useCallback(async (...args: A): Promise<void> => {
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
        } catch (e: any) {
            // Catch any exceptions (e.g., network errors)
            setError(e.message || 'Unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, [serviceFn]);

    return { data, error, loading, execute };
}
