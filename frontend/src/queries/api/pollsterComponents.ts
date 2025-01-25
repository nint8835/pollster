/**
 * Generated by @openapi-codegen
 *
 * @version 0.1.0
 */
import * as reactQuery from '@tanstack/react-query';

import { PollsterContext, usePollsterContext } from './pollsterContext';
import type * as Fetcher from './pollsterFetcher';
import { pollsterFetch } from './pollsterFetcher';
import type * as Schemas from './pollsterSchemas';

export type GetCurrentUserError = Fetcher.ErrorWrapper<undefined>;

export type GetCurrentUserVariables = PollsterContext['fetcherOptions'];

/**
 * Retrieve the details of the current user.
 */
export const fetchGetCurrentUser = (variables: GetCurrentUserVariables, signal?: AbortSignal) =>
    pollsterFetch<Schemas.DiscordUser | null, GetCurrentUserError, undefined, {}, {}, {}>({
        url: '/auth/me',
        method: 'get',
        ...variables,
        signal,
    });

/**
 * Retrieve the details of the current user.
 */
export const useGetCurrentUser = <TData = Schemas.DiscordUser | null>(
    variables: GetCurrentUserVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<Schemas.DiscordUser | null, GetCurrentUserError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { fetcherOptions, queryOptions, queryKeyFn } = usePollsterContext(options);
    return reactQuery.useQuery<Schemas.DiscordUser | null, GetCurrentUserError, TData>({
        queryKey: queryKeyFn({
            path: '/auth/me',
            operationId: 'getCurrentUser',
            variables,
        }),
        queryFn: ({ signal }) => fetchGetCurrentUser({ ...fetcherOptions, ...variables }, signal),
        ...options,
        ...queryOptions,
    });
};

/**
 * Retrieve the details of the current user.
 */
export const useSuspenseGetCurrentUser = <TData = Schemas.DiscordUser | null>(
    variables: GetCurrentUserVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<Schemas.DiscordUser | null, GetCurrentUserError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { fetcherOptions, queryOptions, queryKeyFn } = usePollsterContext(options);
    return reactQuery.useSuspenseQuery<Schemas.DiscordUser | null, GetCurrentUserError, TData>({
        queryKey: queryKeyFn({
            path: '/auth/me',
            operationId: 'getCurrentUser',
            variables,
        }),
        queryFn: ({ signal }) => fetchGetCurrentUser({ ...fetcherOptions, ...variables }, signal),
        ...options,
        ...queryOptions,
    });
};

export type QueryOperation = {
    path: '/auth/me';
    operationId: 'getCurrentUser';
    variables: GetCurrentUserVariables;
};
