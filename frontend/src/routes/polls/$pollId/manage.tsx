import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Plus, Trash, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { StatusCell } from '@/components/status_cell';
import { useStore } from '@/lib/state';
import { useEditPollOption, useSuspenseGetPoll } from '@/queries/api/pollsterComponents';
import { getPollQuery } from '@/queries/api/pollsterFunctions';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/polls/$pollId/manage')({
    component: RouteComponent,
    beforeLoad: () => {
        const isOwner = useStore.getState().user.is_owner;

        if (!isOwner) {
            throw new Error('You must be the owner to manage a poll');
        }
    },
    loader: ({ params }) => queryClient.ensureQueryData(getPollQuery({ pathParams: { pollId: params.pollId } })),
});

function RouteComponent() {
    const { pollId } = Route.useParams();
    const { data: poll } = useSuspenseGetPoll({ pathParams: { pollId } });
    const [options, setOptions] = useState<{ id: number; name: string }[]>(poll.options);
    const [newOption, setNewOption] = useState('');
    return (
        <Card>
            <CardHeader>
                <h2 className="mr-2 text-xl font-semibold">{poll.name}</h2>
                <StatusCell status={poll.status} />
            </CardHeader>
            <CardBody>
                <h3 className="text-lg font-semibold">Options</h3>
                <div className="flex flex-col gap-2">
                    {options.map((option) => (
                        <div className="flex gap-2">
                            <Input
                                // TODO On complete, useEditPollOption
                                key={option.id}
                                value={option.name}
                                onChange={(e) => {
                                    const newOptions = [...options];
                                    newOptions[options.findIndex((o) => o.id === option.id)].name = e.target.value;
                                    setOptions(newOptions);
                                }}
                            />
                            <Button color="danger">
                                {/*TODO On click, useDeletePollOption*/}
                                <Trash2 />
                            </Button>
                        </div>
                    ))}
                    <div className="flex gap-2">
                        <Input
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            onKeyDown={(e) => {
                                // TODO useAddPollOption
                                if (e.key === 'Enter') {
                                    setOptions([...options, { id: options.length + 1, name: newOption }]);
                                    setNewOption('');
                                }
                            }}
                        />
                        <Button color="primary">
                            <Plus />
                        </Button>
                    </div>
                </div>
            </CardBody>
            <CardFooter>
                <div className="flex w-full justify-end gap-2">
                    <Button color="primary">Start Poll</Button>
                    <Button color="danger">Delete Poll</Button>
                </div>
            </CardFooter>
        </Card>
    );
}
