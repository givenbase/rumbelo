/**
 * Thin bridge for mock → live migration (Phase 4).
 * Screens keep mock data until `enabled` is flipped per procedure.
 */
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

export function useLiveQuery<TData>(
  options: UseQueryOptions<TData>,
  mockFallback: TData,
  enabled = false,
): UseQueryResult<TData> {
  const query = useQuery({ ...options, enabled });
  if (!enabled) {
    return {
      ...query,
      data: mockFallback,
      isPending: false,
      isLoading: false,
      isSuccess: true,
      status: 'success',
    } as UseQueryResult<TData>;
  }
  return query;
}
