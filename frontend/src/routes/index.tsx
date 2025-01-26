import { Chip, ChipProps, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';

import { Link } from '@/components/link';
import { useSuspenseListVotes } from '@/queries/api/pollsterComponents';
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

function RouteComponent() {
    const { data: votes } = useSuspenseListVotes({});

    return (
        <Table aria-label="Table of all votes">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.name}>{column.name}</TableColumn>}
            </TableHeader>
            <TableBody items={votes} emptyContent="No votes found">
                {(item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>
                            <Link to="/votes/$voteId" params={{ voteId: item.id.toString() }} color="foreground">
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
    );
}
