import { Card, CardHeader } from '@heroui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';

import { StatusCell } from '@/components/status_cell';
import { getPollOptions } from '@/queries/api';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/(app)/polls/$pollId')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(getPollOptions({ path: { poll_id: params.pollId } })),
});

function RouteComponent() {
  const { pollId } = Route.useParams();
  const { data: poll } = useSuspenseQuery(getPollOptions({ path: { poll_id: pollId } }));

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
