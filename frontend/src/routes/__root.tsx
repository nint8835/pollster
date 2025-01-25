import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';

import { TanStackRouterDevtools } from '@/components/util/router-dev-tools';
import '@/index.css';
import { useStore } from '@/lib/state';
import { fetchGetCurrentUser } from '@/queries/api/pollsterComponents';

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <ReactQueryDevtools initialIsOpen={false} />
            <TanStackRouterDevtools />
        </>
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
