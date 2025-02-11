import { Button, CardFooter, Tooltip } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Edit, Vote } from 'lucide-react';

import { Link } from '@/components/link';
import { useStore } from '@/lib/state';
import { useSuspenseGetPoll } from '@/queries/api/pollsterComponents';
import * as Schemas from '@/queries/api/pollsterSchemas';

export const Route = createFileRoute('/polls/$pollId/')({
    component: RouteComponent,
});

function VoteButton({ poll }: { poll: Schemas.Poll }) {
    const InnerButton = () => (
        <Button startContent={<Vote />} color="primary" isDisabled={poll.status !== Schemas.PollStatus.open}>
            Vote
        </Button>
    );
    switch (poll.status) {
        case Schemas.PollStatus.pending:
            return (
                <Tooltip content="Voting has not yet started.">
                    <span>
                        <InnerButton />
                    </span>
                </Tooltip>
            );
        case Schemas.PollStatus.closed:
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
    const { pollId } = Route.useParams();
    const { data: poll } = useSuspenseGetPoll({ pathParams: { pollId } });
    const isOwner = useStore((state) => state.user.is_owner);

    return (
        <>
            <CardFooter>
                <div className="flex w-full justify-end gap-2">
                    {isOwner && (
                        //@ts-ignore - I can't figure out how to get a `Button` with an `as` of a `Link` to work properly
                        <Button to={'/polls/$pollId/manage'} params={{ pollId }} as={Link} startContent={<Edit />}>
                            Manage
                        </Button>
                    )}
                    <VoteButton poll={poll} />
                </div>
            </CardFooter>
        </>
    );
}
