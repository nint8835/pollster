/**
 * Generated by @openapi-codegen
 *
 * @version 0.1.0
 */
import * as reactQuery from '@tanstack/react-query';

import { PollsterContext, queryKeyFn, usePollsterContext } from './pollsterContext';
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
export const getCurrentUserQuery = (
    variables: GetCurrentUserVariables,
): {
    queryKey: reactQuery.QueryKey;
    queryFn: ({ signal }: { signal?: AbortSignal }) => Promise<Schemas.DiscordUser | null>;
} => ({
    queryKey: queryKeyFn({
        path: '/auth/me',
        operationId: 'getCurrentUser',
        variables,
    }),
    queryFn: ({ signal }: { signal?: AbortSignal }) => fetchGetCurrentUser(variables, signal),
});

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
    const { queryOptions } = usePollsterContext(options);
    return reactQuery.useSuspenseQuery<Schemas.DiscordUser | null, GetCurrentUserError, TData>({
        ...getCurrentUserQuery(variables),
        ...options,
        ...queryOptions,
    });
};

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
    const { queryOptions } = usePollsterContext(options);
    return reactQuery.useQuery<Schemas.DiscordUser | null, GetCurrentUserError, TData>({
        ...getCurrentUserQuery(variables),
        ...options,
        ...queryOptions,
    });
};

export type ListPollsError = Fetcher.ErrorWrapper<{
    status: 401;
    payload: Schemas.ErrorResponse;
}>;

export type ListPollsResponse = Schemas.Poll[];

export type ListPollsVariables = PollsterContext['fetcherOptions'];

/**
 * List all polls.
 */
export const fetchListPolls = (variables: ListPollsVariables, signal?: AbortSignal) =>
    pollsterFetch<ListPollsResponse, ListPollsError, undefined, {}, {}, {}>({
        url: '/api/polls/',
        method: 'get',
        ...variables,
        signal,
    });

/**
 * List all polls.
 */
export const listPollsQuery = (
    variables: ListPollsVariables,
): {
    queryKey: reactQuery.QueryKey;
    queryFn: ({ signal }: { signal?: AbortSignal }) => Promise<ListPollsResponse>;
} => ({
    queryKey: queryKeyFn({
        path: '/api/polls/',
        operationId: 'listPolls',
        variables,
    }),
    queryFn: ({ signal }: { signal?: AbortSignal }) => fetchListPolls(variables, signal),
});

/**
 * List all polls.
 */
export const useSuspenseListPolls = <TData = ListPollsResponse>(
    variables: ListPollsVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<ListPollsResponse, ListPollsError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { queryOptions } = usePollsterContext(options);
    return reactQuery.useSuspenseQuery<ListPollsResponse, ListPollsError, TData>({
        ...listPollsQuery(variables),
        ...options,
        ...queryOptions,
    });
};

/**
 * List all polls.
 */
export const useListPolls = <TData = ListPollsResponse>(
    variables: ListPollsVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<ListPollsResponse, ListPollsError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { queryOptions } = usePollsterContext(options);
    return reactQuery.useQuery<ListPollsResponse, ListPollsError, TData>({
        ...listPollsQuery(variables),
        ...options,
        ...queryOptions,
    });
};

export type CreatePollError = Fetcher.ErrorWrapper<
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

export type CreatePollVariables = {
    body: Schemas.CreatePoll;
} & PollsterContext['fetcherOptions'];

/**
 * Create a new poll.
 */
export const fetchCreatePoll = (variables: CreatePollVariables, signal?: AbortSignal) =>
    pollsterFetch<Schemas.Poll, CreatePollError, Schemas.CreatePoll, {}, {}, {}>({
        url: '/api/polls/',
        method: 'post',
        ...variables,
        signal,
    });

/**
 * Create a new poll.
 */
export const useCreatePoll = (
    options?: Omit<reactQuery.UseMutationOptions<Schemas.Poll, CreatePollError, CreatePollVariables>, 'mutationFn'>,
) => {
    const { fetcherOptions } = usePollsterContext();
    return reactQuery.useMutation<Schemas.Poll, CreatePollError, CreatePollVariables>({
        mutationFn: (variables: CreatePollVariables) => fetchCreatePoll({ ...fetcherOptions, ...variables }),
        ...options,
    });
};

export type GetPollPathParams = {
    pollId: string;
};

export type GetPollError = Fetcher.ErrorWrapper<
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

export type GetPollVariables = {
    pathParams: GetPollPathParams;
} & PollsterContext['fetcherOptions'];

/**
 * Retrieve a poll by ID.
 */
export const fetchGetPoll = (variables: GetPollVariables, signal?: AbortSignal) =>
    pollsterFetch<Schemas.Poll, GetPollError, undefined, {}, {}, GetPollPathParams>({
        url: '/api/polls/{pollId}',
        method: 'get',
        ...variables,
        signal,
    });

/**
 * Retrieve a poll by ID.
 */
export const getPollQuery = (
    variables: GetPollVariables,
): {
    queryKey: reactQuery.QueryKey;
    queryFn: ({ signal }: { signal?: AbortSignal }) => Promise<Schemas.Poll>;
} => ({
    queryKey: queryKeyFn({
        path: '/api/polls/{pollId}',
        operationId: 'getPoll',
        variables,
    }),
    queryFn: ({ signal }: { signal?: AbortSignal }) => fetchGetPoll(variables, signal),
});

/**
 * Retrieve a poll by ID.
 */
export const useSuspenseGetPoll = <TData = Schemas.Poll>(
    variables: GetPollVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<Schemas.Poll, GetPollError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { queryOptions } = usePollsterContext(options);
    return reactQuery.useSuspenseQuery<Schemas.Poll, GetPollError, TData>({
        ...getPollQuery(variables),
        ...options,
        ...queryOptions,
    });
};

/**
 * Retrieve a poll by ID.
 */
export const useGetPoll = <TData = Schemas.Poll>(
    variables: GetPollVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<Schemas.Poll, GetPollError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { queryOptions } = usePollsterContext(options);
    return reactQuery.useQuery<Schemas.Poll, GetPollError, TData>({
        ...getPollQuery(variables),
        ...options,
        ...queryOptions,
    });
};

export type EditPollPathParams = {
    pollId: string;
};

export type EditPollError = Fetcher.ErrorWrapper<
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

export type EditPollVariables = {
    body?: Schemas.EditPoll;
    pathParams: EditPollPathParams;
} & PollsterContext['fetcherOptions'];

/**
 * Edit a poll.
 */
export const fetchEditPoll = (variables: EditPollVariables, signal?: AbortSignal) =>
    pollsterFetch<Schemas.Poll, EditPollError, Schemas.EditPoll, {}, {}, EditPollPathParams>({
        url: '/api/polls/{pollId}',
        method: 'patch',
        ...variables,
        signal,
    });

/**
 * Edit a poll.
 */
export const useEditPoll = (
    options?: Omit<reactQuery.UseMutationOptions<Schemas.Poll, EditPollError, EditPollVariables>, 'mutationFn'>,
) => {
    const { fetcherOptions } = usePollsterContext();
    return reactQuery.useMutation<Schemas.Poll, EditPollError, EditPollVariables>({
        mutationFn: (variables: EditPollVariables) => fetchEditPoll({ ...fetcherOptions, ...variables }),
        ...options,
    });
};

export type CanVotePathParams = {
    pollId: string;
};

export type CanVoteError = Fetcher.ErrorWrapper<
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

export type CanVoteVariables = {
    pathParams: CanVotePathParams;
} & PollsterContext['fetcherOptions'];

/**
 * Check whether the user can vote in a given poll.
 */
export const fetchCanVote = (variables: CanVoteVariables, signal?: AbortSignal) =>
    pollsterFetch<Schemas.CanVote, CanVoteError, undefined, {}, {}, CanVotePathParams>({
        url: '/api/polls/{pollId}/can-vote',
        method: 'get',
        ...variables,
        signal,
    });

/**
 * Check whether the user can vote in a given poll.
 */
export const canVoteQuery = (
    variables: CanVoteVariables,
): {
    queryKey: reactQuery.QueryKey;
    queryFn: ({ signal }: { signal?: AbortSignal }) => Promise<Schemas.CanVote>;
} => ({
    queryKey: queryKeyFn({
        path: '/api/polls/{pollId}/can-vote',
        operationId: 'canVote',
        variables,
    }),
    queryFn: ({ signal }: { signal?: AbortSignal }) => fetchCanVote(variables, signal),
});

/**
 * Check whether the user can vote in a given poll.
 */
export const useSuspenseCanVote = <TData = Schemas.CanVote>(
    variables: CanVoteVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<Schemas.CanVote, CanVoteError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { queryOptions } = usePollsterContext(options);
    return reactQuery.useSuspenseQuery<Schemas.CanVote, CanVoteError, TData>({
        ...canVoteQuery(variables),
        ...options,
        ...queryOptions,
    });
};

/**
 * Check whether the user can vote in a given poll.
 */
export const useCanVote = <TData = Schemas.CanVote>(
    variables: CanVoteVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<Schemas.CanVote, CanVoteError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { queryOptions } = usePollsterContext(options);
    return reactQuery.useQuery<Schemas.CanVote, CanVoteError, TData>({
        ...canVoteQuery(variables),
        ...options,
        ...queryOptions,
    });
};

export type CreateVotePathParams = {
    pollId: string;
};

export type CreateVoteError = Fetcher.ErrorWrapper<
    | {
          status: 400;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 401;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 404;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 409;
          payload: Schemas.ErrorResponse;
      }
    | {
          status: 422;
          payload: Schemas.HTTPValidationError;
      }
>;

export type CreateVoteRequestBody = string[];

export type CreateVoteVariables = {
    body?: CreateVoteRequestBody;
    pathParams: CreateVotePathParams;
} & PollsterContext['fetcherOptions'];

/**
 * Create a new vote for a poll.
 */
export const fetchCreateVote = (variables: CreateVoteVariables, signal?: AbortSignal) =>
    pollsterFetch<void, CreateVoteError, CreateVoteRequestBody, {}, {}, CreateVotePathParams>({
        url: '/api/polls/{pollId}/votes',
        method: 'post',
        ...variables,
        signal,
    });

/**
 * Create a new vote for a poll.
 */
export const useCreateVote = (
    options?: Omit<reactQuery.UseMutationOptions<void, CreateVoteError, CreateVoteVariables>, 'mutationFn'>,
) => {
    const { fetcherOptions } = usePollsterContext();
    return reactQuery.useMutation<void, CreateVoteError, CreateVoteVariables>({
        mutationFn: (variables: CreateVoteVariables) => fetchCreateVote({ ...fetcherOptions, ...variables }),
        ...options,
    });
};

export type ListVotesPathParams = {
    pollId: string;
};

export type ListVotesError = Fetcher.ErrorWrapper<
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

export type ListVotesResponse = string[][];

export type ListVotesVariables = {
    pathParams: ListVotesPathParams;
} & PollsterContext['fetcherOptions'];

/**
 * List all votes for a poll.
 */
export const fetchListVotes = (variables: ListVotesVariables, signal?: AbortSignal) =>
    pollsterFetch<ListVotesResponse, ListVotesError, undefined, {}, {}, ListVotesPathParams>({
        url: '/api/polls/{pollId}/votes',
        method: 'get',
        ...variables,
        signal,
    });

/**
 * List all votes for a poll.
 */
export const listVotesQuery = (
    variables: ListVotesVariables,
): {
    queryKey: reactQuery.QueryKey;
    queryFn: ({ signal }: { signal?: AbortSignal }) => Promise<ListVotesResponse>;
} => ({
    queryKey: queryKeyFn({
        path: '/api/polls/{pollId}/votes',
        operationId: 'listVotes',
        variables,
    }),
    queryFn: ({ signal }: { signal?: AbortSignal }) => fetchListVotes(variables, signal),
});

/**
 * List all votes for a poll.
 */
export const useSuspenseListVotes = <TData = ListVotesResponse>(
    variables: ListVotesVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<ListVotesResponse, ListVotesError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { queryOptions } = usePollsterContext(options);
    return reactQuery.useSuspenseQuery<ListVotesResponse, ListVotesError, TData>({
        ...listVotesQuery(variables),
        ...options,
        ...queryOptions,
    });
};

/**
 * List all votes for a poll.
 */
export const useListVotes = <TData = ListVotesResponse>(
    variables: ListVotesVariables,
    options?: Omit<
        reactQuery.UseQueryOptions<ListVotesResponse, ListVotesError, TData>,
        'queryKey' | 'queryFn' | 'initialData'
    >,
) => {
    const { queryOptions } = usePollsterContext(options);
    return reactQuery.useQuery<ListVotesResponse, ListVotesError, TData>({
        ...listVotesQuery(variables),
        ...options,
        ...queryOptions,
    });
};

export type CreatePollOptionPathParams = {
    pollId: string;
};

export type CreatePollOptionError = Fetcher.ErrorWrapper<
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

export type CreatePollOptionVariables = {
    body: Schemas.CreatePollOption;
    pathParams: CreatePollOptionPathParams;
} & PollsterContext['fetcherOptions'];

/**
 * Create a new option for a poll.
 */
export const fetchCreatePollOption = (variables: CreatePollOptionVariables, signal?: AbortSignal) =>
    pollsterFetch<
        Schemas.PollOption,
        CreatePollOptionError,
        Schemas.CreatePollOption,
        {},
        {},
        CreatePollOptionPathParams
    >({
        url: '/api/polls/{pollId}/options',
        method: 'post',
        ...variables,
        signal,
    });

/**
 * Create a new option for a poll.
 */
export const useCreatePollOption = (
    options?: Omit<
        reactQuery.UseMutationOptions<Schemas.PollOption, CreatePollOptionError, CreatePollOptionVariables>,
        'mutationFn'
    >,
) => {
    const { fetcherOptions } = usePollsterContext();
    return reactQuery.useMutation<Schemas.PollOption, CreatePollOptionError, CreatePollOptionVariables>({
        mutationFn: (variables: CreatePollOptionVariables) =>
            fetchCreatePollOption({ ...fetcherOptions, ...variables }),
        ...options,
    });
};

export type EditPollOptionPathParams = {
    pollId: string;
    optionId: string;
};

export type EditPollOptionError = Fetcher.ErrorWrapper<
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

export type EditPollOptionVariables = {
    body: Schemas.EditPollOption;
    pathParams: EditPollOptionPathParams;
} & PollsterContext['fetcherOptions'];

/**
 * Edit an option for a poll.
 */
export const fetchEditPollOption = (variables: EditPollOptionVariables, signal?: AbortSignal) =>
    pollsterFetch<Schemas.PollOption, EditPollOptionError, Schemas.EditPollOption, {}, {}, EditPollOptionPathParams>({
        url: '/api/polls/{pollId}/options/{optionId}',
        method: 'patch',
        ...variables,
        signal,
    });

/**
 * Edit an option for a poll.
 */
export const useEditPollOption = (
    options?: Omit<
        reactQuery.UseMutationOptions<Schemas.PollOption, EditPollOptionError, EditPollOptionVariables>,
        'mutationFn'
    >,
) => {
    const { fetcherOptions } = usePollsterContext();
    return reactQuery.useMutation<Schemas.PollOption, EditPollOptionError, EditPollOptionVariables>({
        mutationFn: (variables: EditPollOptionVariables) => fetchEditPollOption({ ...fetcherOptions, ...variables }),
        ...options,
    });
};

export type DeletePollOptionPathParams = {
    pollId: string;
    optionId: string;
};

export type DeletePollOptionError = Fetcher.ErrorWrapper<
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

export type DeletePollOptionVariables = {
    pathParams: DeletePollOptionPathParams;
} & PollsterContext['fetcherOptions'];

/**
 * Delete an option for a poll.
 */
export const fetchDeletePollOption = (variables: DeletePollOptionVariables, signal?: AbortSignal) =>
    pollsterFetch<void, DeletePollOptionError, undefined, {}, {}, DeletePollOptionPathParams>({
        url: '/api/polls/{pollId}/options/{optionId}',
        method: 'delete',
        ...variables,
        signal,
    });

/**
 * Delete an option for a poll.
 */
export const useDeletePollOption = (
    options?: Omit<reactQuery.UseMutationOptions<void, DeletePollOptionError, DeletePollOptionVariables>, 'mutationFn'>,
) => {
    const { fetcherOptions } = usePollsterContext();
    return reactQuery.useMutation<void, DeletePollOptionError, DeletePollOptionVariables>({
        mutationFn: (variables: DeletePollOptionVariables) =>
            fetchDeletePollOption({ ...fetcherOptions, ...variables }),
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
          path: '/api/polls/';
          operationId: 'listPolls';
          variables: ListPollsVariables;
      }
    | {
          path: '/api/polls/{pollId}';
          operationId: 'getPoll';
          variables: GetPollVariables;
      }
    | {
          path: '/api/polls/{pollId}/can-vote';
          operationId: 'canVote';
          variables: CanVoteVariables;
      }
    | {
          path: '/api/polls/{pollId}/votes';
          operationId: 'listVotes';
          variables: ListVotesVariables;
      };
