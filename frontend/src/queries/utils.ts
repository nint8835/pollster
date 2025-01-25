import type { EnsureQueryDataOptions, QueryKey } from '@tanstack/react-query';

export function convertQueryOpts<T>(
    opts: [QueryKey, ({ signal }: { signal?: AbortSignal }) => Promise<T>],
): EnsureQueryDataOptions<T> {
    return { queryKey: opts[0], queryFn: opts[1] };
}
