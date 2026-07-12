import { Button, ButtonProps, CardBody, CardFooter, Checkbox, Input } from '@heroui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { pluralize } from '@/lib/utils';
import {
  getPollOptions,
  useCreatePollOptionMutation,
  useDeletePollOptionMutation,
  useEditPollMutation,
  useEditPollOptionMutation,
} from '@/queries/api';
import type { PollStatus } from '@/queries/api';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/(app)/polls/$pollId/manage')({
  component: RouteComponent,
});

function requiredComparisons(itemCount: number): number {
  if (itemCount < 2) {
    return 0;
  }

  return Math.log2(itemCount) + requiredComparisons(itemCount - 1);
}

function RouteComponent() {
  const { pollId } = Route.useParams();
  const pollOptions = getPollOptions({ path: { poll_id: pollId } });
  const { data: poll } = useSuspenseQuery(pollOptions);
  const [newOption, setNewOption] = useState('');
  const { mutateAsync: createPollOption } = useCreatePollOptionMutation();
  const { mutateAsync: editPollOption } = useEditPollOptionMutation();
  const { mutateAsync: deletePollOption } = useDeletePollOptionMutation();
  const [editingOption, setEditingOption] = useState<{ id: string; name: string } | undefined>(undefined);
  const { mutateAsync: editPoll } = useEditPollMutation();

  const requiredComparisonCount = requiredComparisons(poll.options.length);

  const handleCreatePollOption = async () => {
    await createPollOption({
      body: { name: newOption },
      path: { poll_id: pollId },
    });
    setNewOption('');
    await queryClient.invalidateQueries(pollOptions);
  };
  const handleEditPollOption = async () => {
    if (!editingOption) {
      return;
    }
    await editPollOption({
      body: { name: editingOption.name },
      path: { poll_id: pollId, option_id: editingOption.id },
    });
    await queryClient.invalidateQueries(pollOptions);
    setEditingOption(undefined);
  };
  const handleDeletePollOption = async (optionId: string) => {
    await deletePollOption({ path: { poll_id: pollId, option_id: optionId } });
    await queryClient.invalidateQueries(pollOptions);
  };
  const handleToggleAllowUsersToViewResults = async () => {
    await editPoll({
      body: { allow_users_to_view_results: !poll.allow_users_to_view_results },
      path: { poll_id: pollId },
    });
    await queryClient.invalidateQueries(pollOptions);
  };

  const nextPollStatus = (
    {
      pending: 'open',
      open: 'closed',
      closed: null,
    } satisfies Record<PollStatus, PollStatus | null>
  )[poll.status];
  const nextPollPropsRecord: Record<PollStatus, Partial<ButtonProps>> = {
    pending: { color: 'primary', children: 'Open Poll' },
    open: { color: 'danger', children: 'Close Poll' },
    closed: {},
  };

  const handleNextStatus = async () => {
    if (!nextPollStatus) {
      return;
    }

    await editPoll({ body: { status: nextPollStatus }, path: { poll_id: pollId } });
    await queryClient.invalidateQueries(pollOptions);
  };

  return (
    <>
      <CardBody className="space-y-2">
        <h3 className="text-lg font-semibold">Options</h3>
        <div className="flex flex-col gap-2">
          {poll.options.map((option) => (
            <div key={option.id} className="flex gap-2">
              <Input
                key={option.id}
                value={option.id === editingOption?.id ? editingOption.name : option.name}
                onChange={(e) => setEditingOption({ id: option.id, name: e.target.value })}
                onBlur={handleEditPollOption}
              />
              <Button onPress={() => handleDeletePollOption(option.id)} color="danger">
                <Trash2 />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePollOption()}
              onBlur={(e) => {
                if (e.target.value.trim() !== '') {
                  handleCreatePollOption();
                }
              }}
            />
            <Button onPress={handleCreatePollOption} color="primary">
              <Plus />
            </Button>
          </div>
        </div>
        <Checkbox isSelected={poll.allow_users_to_view_results} onChange={handleToggleAllowUsersToViewResults}>
          Allow users to view results
        </Checkbox>
      </CardBody>
      <CardFooter>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="text-zinc-400 italic">
            Voters will be required to complete approximately {Math.ceil(requiredComparisonCount).toLocaleString()}{' '}
            {pluralize(requiredComparisonCount, 'comparison', 'comparisons')}.
          </div>
          {nextPollStatus && <Button onPress={handleNextStatus} {...nextPollPropsRecord[poll.status]}></Button>}
        </div>
      </CardFooter>
    </>
  );
}
