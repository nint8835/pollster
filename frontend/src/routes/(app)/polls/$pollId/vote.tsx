import { Button, CardBody, CardFooter, cn } from '@heroui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { canVoteQuery, useCreateVote, useSuspenseCanVote, useSuspenseGetPoll } from '@/queries/api/pollsterComponents';
import { PollOption } from '@/queries/api/pollsterSchemas';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/(app)/polls/$pollId/vote')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(canVoteQuery({ pathParams: { pollId: params.pollId } })),
});

function VoteInterface({ pollId }: { pollId: string }) {
  const { data: poll } = useSuspenseGetPoll({ pathParams: { pollId } });
  const { mutateAsync: submitVote } = useCreateVote();

  const navigate = useNavigate();

  const [pendingItems, setPendingItems] = useState<PollOption[]>(poll.options.slice(1));
  const [rankedItems, setRankedItems] = useState<PollOption[]>([poll.options[0]]);

  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(1);
  const mid = Math.floor((low + high) / 2);

  function handleVote(setter: (value: number) => void, value: number, low: number, high: number) {
    return () => {
      setter(value);

      if (low >= high) {
        const nextItem = pendingItems[0];
        setPendingItems(pendingItems.slice(1));
        setRankedItems([...rankedItems.slice(0, low), nextItem, ...rankedItems.slice(low)]);
        setLow(0);
        setHigh(rankedItems.length + 1);
      }
    };
  }

  function resetVote() {
    setPendingItems(poll.options.slice(1));
    setRankedItems([poll.options[0]]);
    setLow(0);
    setHigh(1);
  }

  return (
    <>
      <CardBody>
        <div>
          <ol className="list-inside list-decimal">
            {rankedItems
              .map((item, index) => [item, index] as [PollOption | null, number])
              .reverse()
              .concat(
                new Array(poll.options.length - rankedItems.length)
                  .fill(null)
                  .map((_, index) => [null, rankedItems.length + index]),
              )
              .map(([item, index]) => (
                <li
                  className={cn(
                    item === null && 'italic text-zinc-400',
                    index < low || index >= high ? 'opacity-50' : 'opacity-100',
                  )}
                >
                  {item && item.name}
                </li>
              ))}
          </ol>
        </div>
      </CardBody>
      <CardFooter>
        {pendingItems.length > 0 ? (
          <div className="flex w-full flex-col gap-2">
            <div className="text-center italic text-zinc-400">
              Select the option of the two that should be ranked higher.
            </div>
            <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
              <Button color="primary" onPress={handleVote(setHigh, mid, low, mid)}>
                {rankedItems[mid].name}
              </Button>
              <Button color="secondary" onPress={handleVote(setLow, mid + 1, mid + 1, high)}>
                {pendingItems[0].name}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            <div className="text-center italic text-zinc-400">
              Ranking complete. Review your vote above and submit when ready.
            </div>
            <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
              <Button color="danger" onPress={resetVote}>
                Restart
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  await submitVote({
                    pathParams: { pollId },
                    body: rankedItems.map((i) => i.id),
                  });
                  navigate({ to: '/polls/$pollId', params: { pollId } });
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </>
  );
}

function RouteComponent() {
  const { pollId } = Route.useParams();
  const { data: canVote } = useSuspenseCanVote({ pathParams: { pollId } });

  if (!canVote.can_vote) {
    return (
      <CardBody>
        <div>{canVote.reason}</div>
      </CardBody>
    );
  }

  return <VoteInterface pollId={pollId} />;
}
