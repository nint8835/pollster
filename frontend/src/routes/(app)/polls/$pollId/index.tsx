import { Button, CardFooter, Tooltip } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { ChartColumnDecreasing, Edit, Vote } from 'lucide-react';

import { Link } from '@/components/link';
import { useStore } from '@/lib/state';
import { canVoteQuery, useSuspenseCanVote, useSuspenseGetPoll } from '@/queries/api/pollsterComponents';
import * as Schemas from '@/queries/api/pollsterSchemas';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/(app)/polls/$pollId/')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(canVoteQuery({ pathParams: { pollId: params.pollId } })),
});

function VoteButton({ poll }: { poll: Schemas.Poll }) {
  const { data: canVote } = useSuspenseCanVote({
    pathParams: { pollId: poll.id },
  });

  const InnerButton = () => (
    <Button
      to={'/polls/$pollId/vote'}
      //@ts-ignore - I can't figure out how to get a `Button` with an `as` of a `Link` to work properly
      params={{ pollId: poll.id }}
      as={Link}
      startContent={<Vote />}
      color="primary"
      isDisabled={!canVote.can_vote}
    >
      Vote
    </Button>
  );

  if (canVote.can_vote) {
    return <InnerButton />;
  }

  return (
    <Tooltip content={canVote.reason}>
      <span>
        <InnerButton />
      </span>
    </Tooltip>
  );
}

function RouteComponent() {
  const { pollId } = Route.useParams();
  const { data: poll } = useSuspenseGetPoll({ pathParams: { pollId } });
  const userId = useStore((state) => state.user.id);
  const isOwner = useStore((state) => state.user.is_owner);
  const canManage = poll.owner_id === userId || isOwner;

  return (
    <>
      <CardFooter>
        <div className="flex w-full justify-end gap-2">
          {(poll.allow_users_to_view_results || canManage) && (
            <Button
              to={'/polls/$pollId/results'}
              //@ts-ignore - I can't figure out how to get a `Button` with an `as` of a `Link` to work properly
              params={{ pollId }}
              as={Link}
              startContent={<ChartColumnDecreasing />}
            >
              Results
            </Button>
          )}
          {canManage && (
            <Button
              to={'/polls/$pollId/manage'}
              //@ts-ignore - I can't figure out how to get a `Button` with an `as` of a `Link` to work properly
              params={{ pollId }}
              as={Link}
              startContent={<Edit />}
            >
              Manage
            </Button>
          )}
          <VoteButton poll={poll} />
        </div>
      </CardFooter>
    </>
  );
}
