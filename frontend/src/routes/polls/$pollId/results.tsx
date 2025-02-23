import { CardBody } from '@heroui/react';
import { ResponsiveBar } from '@nivo/bar';
import { colorSchemes } from '@nivo/colors';
import { createFileRoute } from '@tanstack/react-router';

import { useStore } from '@/lib/state';
import { listVotesQuery, useSuspenseGetPoll, useSuspenseListVotes } from '@/queries/api/pollsterComponents';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/polls/$pollId/results')({
    component: RouteComponent,
    beforeLoad: () => {
        const isOwner = useStore.getState().user.is_owner;

        if (!isOwner) {
            throw new Error('You must be the owner to manage a poll');
        }
    },
    loader: ({ params }) => queryClient.ensureQueryData(listVotesQuery({ pathParams: { pollId: params.pollId } })),
});

function RouteComponent() {
    const { pollId } = Route.useParams();
    const { data: poll } = useSuspenseGetPoll({ pathParams: { pollId } });
    const { data: votes } = useSuspenseListVotes({ pathParams: { pollId } }, { refetchInterval: 5000 });

    const scores = poll.options
        .map((option) => ({
            id: option.id,
            name: option.name,
            points: votes.map((vote) => vote.indexOf(option.id) + 1).reduce((acc, cur) => acc + cur, 0),
        }))
        .sort((a, b) => b.points - a.points);

    return (
        <CardBody className="h-96">
            <ResponsiveBar
                data={scores}
                indexBy="name"
                keys={['points']}
                margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                padding={0.3}
                isInteractive={false}
                colors={({ data }) => colorSchemes.pastel1[poll.options.findIndex((option) => option.id === data.id)]}
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
        </CardBody>
    );
}
