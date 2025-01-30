import { Button, Card, CardFooter, CardHeader, Tooltip } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Edit, Vote } from 'lucide-react';

import { Link } from '@/components/link';
import { useStore } from '@/lib/state';
import { useSuspenseGetVote } from '@/queries/api/pollsterComponents';
import { getVoteQuery } from '@/queries/api/pollsterFunctions';
import * as Schemas from '@/queries/api/pollsterSchemas';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/votes/$voteId/')({
    component: RouteComponent,
    loader: ({ params }) => queryClient.ensureQueryData(getVoteQuery({ pathParams: { voteId: params.voteId } })),
});

function VoteButton({ vote }: { vote: Schemas.Vote }) {
    const InnerButton = () => (
        <Button startContent={<Vote />} color="primary" isDisabled={vote.status !== Schemas.VoteStatus.open}>
            Vote
        </Button>
    );
    switch (vote.status) {
        case Schemas.VoteStatus.pending:
            return (
                <Tooltip content="Voting has not yet started.">
                    <span>
                        <InnerButton />
                    </span>
                </Tooltip>
            );
        case Schemas.VoteStatus.closed:
            return (
                <Tooltip content="Voting has ended.">
                    <span>
                        <InnerButton />
                    </span>
                </Tooltip>
            );
        default:
            return <InnerButton />;
    }
}

function RouteComponent() {
    const { voteId } = Route.useParams();
    const { data: vote } = useSuspenseGetVote({ pathParams: { voteId } });
    const isOwner = useStore((state) => state.user.is_owner);

    return (
        <div>
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">{vote.name}</h2>
                </CardHeader>
                <CardFooter>
                    <div className="flex w-full justify-end gap-2">
                        {isOwner && (
                            //@ts-ignore - I can't figure out how to get a `Button` with an `as` of a `Link` to work properly
                            <Button to={'/votes/$voteId/manage'} params={{ voteId }} as={Link} startContent={<Edit />}>
                                Manage
                            </Button>
                        )}
                        <VoteButton vote={vote} />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
