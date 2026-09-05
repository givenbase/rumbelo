/**
 * Query helper for household-scoped screens.
 * When `enabled` is false (no household), returns empty fallback without hitting the network.
 */
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

export function useLiveQuery<TData>(
    options: UseQueryOptions<TData>,
    emptyFallback: TData,
    enabled = false
): UseQueryResult<TData> {
    const query = useQuery({ ...options, enabled });
    if (!enabled) {
        return {
            ...query,
            data: emptyFallback,
            isPending: false,
            isLoading: false,
            isFetching: false,
            isSuccess: true,
            status: 'success',
        } as UseQueryResult<TData>;
    }
    return {
        ...query,
        data: query.data !== undefined ? query.data : emptyFallback,
    } as UseQueryResult<TData>;
}
