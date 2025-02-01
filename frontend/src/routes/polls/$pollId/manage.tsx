import { Code } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';

import { useStore } from '@/lib/state';
import { useSuspenseGetPoll } from '@/queries/api/pollsterComponents';
import { getPollQuery } from '@/queries/api/pollsterFunctions';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/polls/$pollId/manage')({
    component: RouteComponent,
    beforeLoad: () => {
        const isOwner = useStore.getState().user.is_owner;

        if (!isOwner) {
            throw new Error('You must be the owner to manage a poll');
        }
    },
    loader: ({ params }) => queryClient.ensureQueryData(getPollQuery({ pathParams: { pollId: params.pollId } })),
});

function RouteComponent() {
    const { pollId } = Route.useParams();
    const { data: poll } = useSuspenseGetPoll({ pathParams: { pollId } });
    return (
        <div>
            <Code className="w-full whitespace-pre">{JSON.stringify(poll, null, 2)}</Code>
        </div>
    );
}
