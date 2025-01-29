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

export type ListVotesError = Fetcher.ErrorWrapper<{
    status: 401;
    payload: Schemas.ErrorResponse;
}>;

export type ListVotesResponse = Schemas.Vote[];

export type ListVotesVariables = PollsterContext['fetcherOptions'];

/**
 * List all votes.
 */
export const fetchListVotes = (variables: ListVotesVariables, signal?: AbortSignal) =>
    pollsterFetch<ListVotesResponse, ListVotesError, undefined, {}, {}, {}>({
        url: '/api/votes/',
        method: 'get',
        ...variables,
        signal,
    });

/**
 * List all votes.
 */
export const useListVotes = <TData = ListVotesResponse>(
    variables: ListVotesVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<ListVotesResponse, ListVotesError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { fetcherOptions, queryOptions, queryKeyFn } = usePollsterContext(options);
    return reactQuery.useQuery<ListVotesResponse, ListVotesError, TData>({
        queryKey: queryKeyFn({
            path: '/api/votes/',
            operationId: 'listVotes',
            variables,
        }),
        queryFn: ({ signal }) => fetchListVotes({ ...fetcherOptions, ...variables }, signal),
        ...options,
        ...queryOptions,
    });
};

/**
 * List all votes.
 */
export const useSuspenseListVotes = <TData = ListVotesResponse>(
    variables: ListVotesVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<ListVotesResponse, ListVotesError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { fetcherOptions, queryOptions, queryKeyFn } = usePollsterContext(options);
    return reactQuery.useSuspenseQuery<ListVotesResponse, ListVotesError, TData>({
        queryKey: queryKeyFn({
            path: '/api/votes/',
            operationId: 'listVotes',
            variables,
        }),
        queryFn: ({ signal }) => fetchListVotes({ ...fetcherOptions, ...variables }, signal),
        ...options,
        ...queryOptions,
    });
};

export type CreateVoteError = Fetcher.ErrorWrapper<
    | {
          status: 401;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 403;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 422;
          payload: Schemas.HTTPValidationError;
      }
>;

export type CreateVoteVariables = {
    body: Schemas.CreateVote;
} & PollsterContext['fetcherOptions'];

/**
 * Create a new vote.
 */
export const fetchCreateVote = (variables: CreateVoteVariables, signal?: AbortSignal) =>
    pollsterFetch<Schemas.Vote, CreateVoteError, Schemas.CreateVote, {}, {}, {}>({
        url: '/api/votes/',
        method: 'post',
        ...variables,
        signal,
    });

/**
 * Create a new vote.
 */
export const useCreateVote = (
    options?: Omit<reactQuery.UseMutationOptions<Schemas.Vote, CreateVoteError, CreateVoteVariables>, 'mutationFn'>,
) => {
    const { fetcherOptions } = usePollsterContext();
    return reactQuery.useMutation<Schemas.Vote, CreateVoteError, CreateVoteVariables>({
        mutationFn: (variables: CreateVoteVariables) => fetchCreateVote({ ...fetcherOptions, ...variables }),
        ...options,
    });
};

export type GetVotePathParams = {
    voteId: string;
};

export type GetVoteError = Fetcher.ErrorWrapper<
    | {
          status: 401;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 404;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 422;
          payload: Schemas.HTTPValidationError;
      }
>;

export type GetVoteVariables = {
    pathParams: GetVotePathParams;
} & PollsterContext['fetcherOptions'];

/**
 * Retrieve a vote by ID.
 */
export const fetchGetVote = (variables: GetVoteVariables, signal?: AbortSignal) =>
    pollsterFetch<Schemas.Vote, GetVoteError, undefined, {}, {}, GetVotePathParams>({
        url: '/api/votes/{voteId}',
        method: 'get',
        ...variables,
        signal,
    });

/**
 * Retrieve a vote by ID.
 */
export const useGetVote = <TData = Schemas.Vote>(
    variables: GetVoteVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<Schemas.Vote, GetVoteError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { fetcherOptions, queryOptions, queryKeyFn } = usePollsterContext(options);
    return reactQuery.useQuery<Schemas.Vote, GetVoteError, TData>({
        queryKey: queryKeyFn({
            path: '/api/votes/{voteId}',
            operationId: 'getVote',
            variables,
        }),
        queryFn: ({ signal }) => fetchGetVote({ ...fetcherOptions, ...variables }, signal),
        ...options,
        ...queryOptions,
    });
};

/**
 * Retrieve a vote by ID.
 */
export const useSuspenseGetVote = <TData = Schemas.Vote>(
    variables: GetVoteVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<Schemas.Vote, GetVoteError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { fetcherOptions, queryOptions, queryKeyFn } = usePollsterContext(options);
    return reactQuery.useSuspenseQuery<Schemas.Vote, GetVoteError, TData>({
        queryKey: queryKeyFn({
            path: '/api/votes/{voteId}',
            operationId: 'getVote',
            variables,
        }),
        queryFn: ({ signal }) => fetchGetVote({ ...fetcherOptions, ...variables }, signal),
        ...options,
        ...queryOptions,
    });
};

export type CreateVoteOptionPathParams = {
    voteId: string;
};

export type CreateVoteOptionError = Fetcher.ErrorWrapper<
    | {
          status: 401;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 403;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 404;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 422;
          payload: Schemas.HTTPValidationError;
      }
>;

export type CreateVoteOptionVariables = {
    body: Schemas.CreateVoteOption;
    pathParams: CreateVoteOptionPathParams;
} & PollsterContext['fetcherOptions'];

/**
 * Create a new option for a vote.
 */
export const fetchCreateVoteOption = (variables: CreateVoteOptionVariables, signal?: AbortSignal) =>
    pollsterFetch<
        Schemas.VoteOption,
        CreateVoteOptionError,
        Schemas.CreateVoteOption,
        {},
        {},
        CreateVoteOptionPathParams
    >({
        url: '/api/votes/{voteId}/options',
        method: 'post',
        ...variables,
        signal,
    });

/**
 * Create a new option for a vote.
 */
export const useCreateVoteOption = (
    options?: Omit<
        reactQuery.UseMutationOptions<Schemas.VoteOption, CreateVoteOptionError, CreateVoteOptionVariables>,
        'mutationFn'
    >,
) => {
    const { fetcherOptions } = usePollsterContext();
    return reactQuery.useMutation<Schemas.VoteOption, CreateVoteOptionError, CreateVoteOptionVariables>({
        mutationFn: (variables: CreateVoteOptionVariables) =>
            fetchCreateVoteOption({ ...fetcherOptions, ...variables }),
        ...options,
    });
};

export type EditVoteOptionPathParams = {
    voteId: string;
    optionId: string;
};

export type EditVoteOptionError = Fetcher.ErrorWrapper<
    | {
          status: 401;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 403;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 404;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 422;
          payload: Schemas.HTTPValidationError;
      }
>;

export type EditVoteOptionVariables = {
    body: Schemas.EditVoteOption;
    pathParams: EditVoteOptionPathParams;
} & PollsterContext['fetcherOptions'];

/**
 * Edit an option for a vote.
 */
export const fetchEditVoteOption = (variables: EditVoteOptionVariables, signal?: AbortSignal) =>
    pollsterFetch<Schemas.VoteOption, EditVoteOptionError, Schemas.EditVoteOption, {}, {}, EditVoteOptionPathParams>({
        url: '/api/votes/{voteId}/options/{optionId}',
        method: 'patch',
        ...variables,
        signal,
    });

/**
 * Edit an option for a vote.
 */
export const useEditVoteOption = (
    options?: Omit<
        reactQuery.UseMutationOptions<Schemas.VoteOption, EditVoteOptionError, EditVoteOptionVariables>,
        'mutationFn'
    >,
) => {
    const { fetcherOptions } = usePollsterContext();
    return reactQuery.useMutation<Schemas.VoteOption, EditVoteOptionError, EditVoteOptionVariables>({
        mutationFn: (variables: EditVoteOptionVariables) => fetchEditVoteOption({ ...fetcherOptions, ...variables }),
        ...options,
    });
};

export type QueryOperation =
    | {
          path: '/auth/me';
          operationId: 'getCurrentUser';
          variables: GetCurrentUserVariables;
      }
    | {
          path: '/api/votes/';
          operationId: 'listVotes';
          variables: ListVotesVariables;
      }
    | {
          path: '/api/votes/{voteId}';
          operationId: 'getVote';
          variables: GetVoteVariables;
      };
