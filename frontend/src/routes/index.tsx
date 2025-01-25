import { createFileRoute } from '@tanstack/react-router';

import { useSuspenseListVotes } from '@/queries/api/pollsterComponents';
import '@/queries/api/pollsterFunctions';
import { listVotesQuery } from '@/queries/api/pollsterFunctions';
import { queryClient } from '@/queries/client';
import { convertQueryOpts } from '@/queries/utils';

export const Route = createFileRoute('/')({
    component: Index,
    loader: () => queryClient.ensureQueryData(convertQueryOpts(listVotesQuery({}))),
});

function Index() {
    const { data: votes } = useSuspenseListVotes({});
    console.log(votes);
    return <div className="p-2">Test</div>;
}
