import { Code } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';

import { useSuspenseGetVote } from '@/queries/api/pollsterComponents';
import { getVoteQuery } from '@/queries/api/pollsterFunctions';
import { queryClient } from '@/queries/client';
import { convertQueryOpts } from '@/queries/utils';

export const Route = createFileRoute('/votes/$voteId/')({
    component: RouteComponent,
    loader: ({ params }) =>
        queryClient.ensureQueryData(convertQueryOpts(getVoteQuery({ pathParams: { voteId: params.voteId } }))),
});

function RouteComponent() {
    const { voteId } = Route.useParams();
    const { data: vote } = useSuspenseGetVote({ pathParams: { voteId } });
    return <Code className="whitespace-pre">{JSON.stringify(vote, null, 2)}</Code>;
}
