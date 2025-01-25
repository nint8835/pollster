import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';

import { TanStackRouterDevtools } from '@/components/util/router-dev-tools';
import '@/index.css';
import { useStore } from '@/lib/state';
import { fetchGetCurrentUser } from '@/queries/api/pollsterComponents';
import { queryClient } from '@/queries/client';

export const Route = createRootRoute({
    component: () => (
        <QueryClientProvider client={queryClient}>
            <Outlet />
            <ReactQueryDevtools initialIsOpen={false} />
            <TanStackRouterDevtools />
        </QueryClientProvider>
    ),

    beforeLoad: async () => {
        const currentUser = await fetchGetCurrentUser({});
        if (!currentUser) {
            window.location.href = '/auth/login';
            return;
        }
        useStore.getState().setUser(currentUser);
    },
});
