import { Chip, ChipProps } from '@heroui/react';

import type { PollStatus } from '@/queries/api';

export const StatusCell = ({ status }: { status: PollStatus }) => {
  const props: Record<PollStatus, Partial<ChipProps>> = {
    pending: {
      color: 'warning',
      children: 'Pending',
    },
    open: {
      color: 'success',
      children: 'Open',
    },
    closed: {
      color: 'danger',
      children: 'Closed',
    },
  };

  return <Chip {...props[status]} variant="dot" size="sm" />;
};
