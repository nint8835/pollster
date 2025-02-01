import {
    Button,
    Chip,
    ChipProps,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from '@heroui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Link } from '@/components/link';
import { useStore } from '@/lib/state';
import { useCreatePoll, useSuspenseListPolls } from '@/queries/api/pollsterComponents';
import { listPollsQuery } from '@/queries/api/pollsterFunctions';
import { PollStatus } from '@/queries/api/pollsterSchemas';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/')({
    component: RouteComponent,
    loader: () => queryClient.ensureQueryData(listPollsQuery({})),
});

const columns = [{ name: 'ID' }, { name: 'Name' }, { name: 'Status' }];

function StatusCell({ status }: { status: PollStatus }) {
    const props: Record<PollStatus, Partial<ChipProps>> = {
        [PollStatus.pending]: {
            color: 'warning',
            children: 'Pending',
        },
        [PollStatus.open]: {
            color: 'success',
            children: 'Open',
        },
        [PollStatus.closed]: {
            color: 'danger',
            children: 'Closed',
        },
    };

    return <Chip {...props[status]} variant="dot" size="sm" />;
}

function CreateVoteModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) {
    const { mutateAsync: createPoll } = useCreatePoll();
    const [name, setName] = useState('');
    const navigate = useNavigate();

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                <ModalHeader>Create Poll</ModalHeader>
                <ModalBody>
                    <Input label="Name" value={name} onValueChange={setName} />
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onPress={async () => {
                            const newPoll = await createPoll({ body: { name } });
                            queryClient.invalidateQueries(listPollsQuery({}));
                            onOpenChange(false);
                            navigate({ to: '/polls/$pollId/manage', params: { pollId: newPoll.id.toString() } });
                        }}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

function RouteComponent() {
    const { data: votes } = useSuspenseListPolls({});
    const isOwner = useStore((state) => state.user.is_owner);
    const {
        isOpen: isCreateModalOpen,
        onOpen: onCreateModalOpen,
        onOpenChange: onCreateModalOpenChange,
    } = useDisclosure();

    return (
        <>
            <div className="space-y-4">
                <Table aria-label="Table of all polls">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.name}>{column.name}</TableColumn>}
                    </TableHeader>
                    <TableBody items={votes} emptyContent="No polls found">
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>
                                    <Link
                                        to="/polls/$pollId"
                                        params={{ pollId: item.id.toString() }}
                                        color="foreground"
                                    >
                                        {item.name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <StatusCell status={item.status} />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {isOwner && (
                    <div className="flex justify-center">
                        <Button startContent={<Plus />} onPress={onCreateModalOpen}>
                            Create Poll
                        </Button>
                    </div>
                )}
            </div>
            <CreateVoteModal isOpen={isCreateModalOpen} onOpenChange={onCreateModalOpenChange} />
        </>
    );
}
