import { Card, CardHeader } from '@heroui/react';
import { Outlet, createFileRoute } from '@tanstack/react-router';

import { StatusCell } from '@/components/status_cell';
import { useSuspenseGetPoll } from '@/queries/api/pollsterComponents';
import { getPollQuery } from '@/queries/api/pollsterFunctions';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/polls/$pollId')({
    component: RouteComponent,
    loader: ({ params }) => queryClient.ensureQueryData(getPollQuery({ pathParams: { pollId: params.pollId } })),
});

function RouteComponent() {
    const { pollId } = Route.useParams();
    const { data: poll } = useSuspenseGetPoll({ pathParams: { pollId } });

    return (
        <Card>
            <CardHeader>
                <h2 className="mr-2 text-xl font-semibold">{poll.name}</h2>
                <StatusCell status={poll.status} />
            </CardHeader>
            <Outlet />
        </Card>
    );
}
