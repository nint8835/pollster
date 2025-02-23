import { Button, ButtonProps, CardBody, CardFooter, Input } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useStore } from '@/lib/state';
import { pluralize } from '@/lib/utils';
import {
    useCreatePollOption,
    useDeletePollOption,
    useEditPoll,
    useEditPollOption,
    useSuspenseGetPoll,
} from '@/queries/api/pollsterComponents';
import { getPollQuery } from '@/queries/api/pollsterFunctions';
import { PollStatus } from '@/queries/api/pollsterSchemas';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/polls/$pollId/manage')({
    component: RouteComponent,
    beforeLoad: () => {
        const isOwner = useStore.getState().user.is_owner;

        if (!isOwner) {
            throw new Error('You must be the owner to manage a poll');
        }
    },
});

function requiredComparisons(itemCount: number): number {
    if (itemCount < 2) {
        return 0;
    }

    return Math.log2(itemCount) + requiredComparisons(itemCount - 1);
}

function RouteComponent() {
    const { pollId } = Route.useParams();
    const { data: poll } = useSuspenseGetPoll({ pathParams: { pollId } });
    const [newOption, setNewOption] = useState('');
    const { mutateAsync: createPollOption } = useCreatePollOption();
    const { mutateAsync: editPollOption } = useEditPollOption();
    const { mutateAsync: deletePollOption } = useDeletePollOption();
    const [editingOption, setEditingOption] = useState<{ id: string; name: string } | undefined>(undefined);
    const { mutateAsync: editPoll } = useEditPoll();

    const requiredComparisonCount = requiredComparisons(poll.options.length);

    const handleCreatePollOption = async () => {
        await createPollOption({ body: { name: newOption }, pathParams: { pollId } });
        setNewOption('');
        await queryClient.invalidateQueries(getPollQuery({ pathParams: { pollId } }));
    };
    const handleEditPollOption = async () => {
        if (!editingOption) {
            return;
        }
        await editPollOption({
            body: { name: editingOption.name },
            pathParams: { pollId, optionId: editingOption.id },
        });
        await queryClient.invalidateQueries(getPollQuery({ pathParams: { pollId } }));
        setEditingOption(undefined);
    };
    const handleDeletePollOption = async (optionId: string) => {
        await deletePollOption({ pathParams: { pollId, optionId: optionId } });
        await queryClient.invalidateQueries(getPollQuery({ pathParams: { pollId } }));
    };

    const nextPollStatus: PollStatus | null = {
        [PollStatus.pending]: PollStatus.open,
        [PollStatus.open]: PollStatus.closed,
        [PollStatus.closed]: null,
    }[poll.status];
    const nextPollPropsRecord: Record<PollStatus, Partial<ButtonProps>> = {
        [PollStatus.pending]: { color: 'primary', children: 'Open Poll' },
        [PollStatus.open]: { color: 'danger', children: 'Close Poll' },
        [PollStatus.closed]: {},
    };

    const handleNextStatus = async () => {
        if (!nextPollStatus) {
            return;
        }

        await editPoll({ body: { status: nextPollStatus }, pathParams: { pollId } });
        await queryClient.invalidateQueries(getPollQuery({ pathParams: { pollId } }));
    };

    return (
        <>
            <CardBody>
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
            </CardBody>
            <CardFooter>
                <div className="flex w-full items-center justify-between gap-2">
                    <div className="italic text-zinc-400">
                        Voters will be required to complete approximately {requiredComparisonCount.toLocaleString()}{' '}
                        {pluralize(requiredComparisonCount, 'comparison', 'comparisons')}.
                    </div>
                    {nextPollStatus && (
                        <Button onPress={handleNextStatus} {...nextPollPropsRecord[poll.status]}></Button>
                    )}
                </div>
            </CardFooter>
        </>
    );
}
