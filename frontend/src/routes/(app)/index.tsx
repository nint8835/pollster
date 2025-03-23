import {
  Button,
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
import { StatusCell } from '@/components/status_cell';
import { useStore } from '@/lib/state';
import { listPollsQuery, useCreatePoll, useSuspenseListPolls } from '@/queries/api/pollsterComponents';
import { queryClient } from '@/queries/client';

export const Route = createFileRoute('/(app)/')({
  component: RouteComponent,
  loader: () => queryClient.ensureQueryData(listPollsQuery({})),
});

const columns = [{ name: 'ID' }, { name: 'Name' }, { name: 'Status' }];

function CreatePollModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) {
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
              navigate({
                to: '/polls/$pollId/manage',
                params: { pollId: newPoll.id },
              });
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
  const { data: polls } = useSuspenseListPolls({});
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
          <TableBody items={polls} emptyContent="No polls found">
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <Link to="/polls/$pollId" params={{ pollId: item.id }} color="foreground">
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
        <div className="flex justify-center">
          <Button startContent={<Plus />} onPress={onCreateModalOpen}>
            Create Poll
          </Button>
        </div>
      </div>
      <CreatePollModal isOpen={isCreateModalOpen} onOpenChange={onCreateModalOpenChange} />
    </>
  );
}
