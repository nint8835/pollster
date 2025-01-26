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
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Link } from '@/components/link';
import { useStore } from '@/lib/state';
import { useCreateVote, useSuspenseListVotes } from '@/queries/api/pollsterComponents';
import { listVotesQuery } from '@/queries/api/pollsterFunctions';
import { VoteStatus } from '@/queries/api/pollsterSchemas';
import { queryClient } from '@/queries/client';
import { convertQueryOpts } from '@/queries/utils';

export const Route = createFileRoute('/')({
    component: RouteComponent,
    loader: () => queryClient.ensureQueryData(convertQueryOpts(listVotesQuery({}))),
});

const columns = [{ name: 'ID' }, { name: 'Name' }, { name: 'Status' }];

function StatusCell({ status }: { status: VoteStatus }) {
    const props: Record<VoteStatus, Partial<ChipProps>> = {
        [VoteStatus.pending]: {
            color: 'warning',
            children: 'Pending',
        },
        [VoteStatus.open]: {
            color: 'success',
            children: 'Open',
        },
        [VoteStatus.closed]: {
            color: 'danger',
            children: 'Closed',
        },
    };

    return <Chip {...props[status]} variant="dot" size="sm" />;
}

function CreateVoteModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) {
    const { mutateAsync: createVote } = useCreateVote();
    const [name, setName] = useState('');

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Create Vote</ModalHeader>
                <ModalBody>
                    <Input label="Name" value={name} onValueChange={setName} />
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onPress={async () => {
                            await createVote({ body: { name } });
                            queryClient.invalidateQueries({ queryKey: listVotesQuery({})[0] });
                            onOpenChange(false);
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
    const { data: votes } = useSuspenseListVotes({});
    const isOwner = useStore((state) => state.user.is_owner);
    const {
        isOpen: isCreateModalOpen,
        onOpen: onCreateModalOpen,
        onOpenChange: onCreateModalOpenChange,
    } = useDisclosure();

    return (
        <>
            <div className="space-y-4">
                <Table aria-label="Table of all votes">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.name}>{column.name}</TableColumn>}
                    </TableHeader>
                    <TableBody items={votes} emptyContent="No votes found">
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>
                                    <Link
                                        to="/votes/$voteId"
                                        params={{ voteId: item.id.toString() }}
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
                            Create Vote
                        </Button>
                    </div>
                )}
            </div>
            <CreateVoteModal isOpen={isCreateModalOpen} onOpenChange={onCreateModalOpenChange} />
        </>
    );
}
