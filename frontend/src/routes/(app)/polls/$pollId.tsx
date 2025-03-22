import { Card, CardHeader } from '@heroui/react';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';

import { StatusCell } from '@/components/status_cell';
import { getPollQuery, useSuspenseGetPoll } from '@/queries/api/pollsterComponents';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/(app)/polls/$pollId')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(getPollQuery({ pathParams: { pollId: params.pollId } })),
});

function RouteComponent() {
  const { pollId } = Route.useParams();
  const { data: poll } = useSuspenseGetPoll({ pathParams: { pollId } });

  return (
    <Card>
      <CardHeader>
        <Link to="/polls/$pollId" params={{ pollId }}>
          <h2 className="mr-2 text-xl font-semibold">{poll.name}</h2>
        </Link>
        <StatusCell status={poll.status} />
      </CardHeader>
      <Outlet />
    </Card>
  );
}
