import { Button, CardFooter, Tooltip } from '@heroui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ChartColumnDecreasing, Edit, Vote } from 'lucide-react';

import { Link } from '@/components/link';
import { useStore } from '@/lib/state';
import { canVoteOptions, getPollOptions } from '@/queries/api';
import type { Poll } from '@/queries/api';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/(app)/polls/$pollId/')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(canVoteOptions({ path: { poll_id: params.pollId } })),
});

function VoteButton({ poll }: { poll: Poll }) {
  const { data: canVote } = useSuspenseQuery(canVoteOptions({ path: { poll_id: poll.id } }));

  const innerButton = (
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
    return innerButton;
  }

  return (
    <Tooltip content={canVote.reason}>
      <span>{innerButton}</span>
    </Tooltip>
  );
}

function RouteComponent() {
  const { pollId } = Route.useParams();
  const { data: poll } = useSuspenseQuery(getPollOptions({ path: { poll_id: pollId } }));
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
