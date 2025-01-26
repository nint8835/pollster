import { Code } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';

import { useStore } from '@/lib/state';
import { useSuspenseGetVote } from '@/queries/api/pollsterComponents';
import { getVoteQuery } from '@/queries/api/pollsterFunctions';
import { queryClient } from '@/queries/client';
import { convertQueryOpts } from '@/queries/utils';

export const Route = createFileRoute('/votes/$voteId/manage')({
    component: RouteComponent,
    beforeLoad: () => {
        const isOwner = useStore.getState().user.is_owner;

        if (!isOwner) {
            throw new Error('You must be the owner to manage a vote');
        }
    },
    loader: ({ params }) =>
        queryClient.ensureQueryData(convertQueryOpts(getVoteQuery({ pathParams: { voteId: params.voteId } }))),
});

function RouteComponent() {
    const { voteId } = Route.useParams();
    const { data: vote } = useSuspenseGetVote({ pathParams: { voteId } });
    return (
        <div>
            <Code className="w-full whitespace-pre">{JSON.stringify(vote, null, 2)}</Code>
        </div>
    );
}
