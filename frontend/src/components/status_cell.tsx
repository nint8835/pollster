import { Chip, ChipProps } from '@heroui/react';

import { PollStatus } from '@/queries/api/pollsterSchemas';

export const StatusCell = ({ status }: { status: PollStatus }) => {
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
};
