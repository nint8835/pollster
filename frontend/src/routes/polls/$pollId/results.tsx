import { ResponsiveBar } from '@nivo/bar';
import { colorSchemes } from '@nivo/colors';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { getPollOptions, listVotesOptions } from '@/queries/api';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/polls/$pollId/results')({
  component: RouteComponent,
  loader: ({ params }) =>
    Promise.all([
      queryClient.ensureQueryData(listVotesOptions({ path: { poll_id: params.pollId } })),
      queryClient.ensureQueryData(getPollOptions({ path: { poll_id: params.pollId } })),
    ]),
});

function RouteComponent() {
  const { pollId } = Route.useParams();
  const { data: poll } = useSuspenseQuery(getPollOptions({ path: { poll_id: pollId } }));
  const { data: votes } = useSuspenseQuery({
    ...listVotesOptions({ path: { poll_id: pollId } }),
    refetchInterval: 5000,
  });

  const scores = poll.options
    .map((option) => ({ id: option.id, name: option.name, points: votes[option.id] }))
    .sort((a, b) => b.points - a.points);

  return (
    <ResponsiveBar
      data={scores}
      indexBy="name"
      keys={['points']}
      margin={{ top: 50, right: 130, bottom: 200, left: 60 }}
      padding={0.3}
      isInteractive={false}
      colors={({ data }) =>
        colorSchemes.pastel1[poll.options.findIndex((option) => option.id === data.id) % colorSchemes.pastel1.length]
      }
      theme={{
        labels: {
          text: {
            fontSize: 'large',
            color: 'white',
          },
        },
        axis: {
          ticks: {
            text: {
              fontSize: 'medium',
              fill: 'white',
            },
          },
        },
      }}
      labelTextColor="#222222"
      axisBottom={{ tickRotation: 25 }}
      axisLeft={null}
    />
  );
}
