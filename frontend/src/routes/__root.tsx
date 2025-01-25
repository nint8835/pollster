import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';

import { TanStackRouterDevtools } from '@/components/util/router-dev-tools';
import '@/index.css';
import { useStore } from '@/lib/state';
import { fetchGetCurrentUser } from '@/queries/api/pollsterComponents';

export const Route = createRootRoute({
    component: Root,
    beforeLoad: async ({ location }) => {
        const currentUser = await fetchGetCurrentUser({});
        if (!currentUser) {
            window.location.href = `/auth/login?next=${encodeURIComponent(location.href)}`;
            return;
        }
        useStore.getState().setUser(currentUser);
    },
});

function Root() {
    return (
        <>
            <Outlet />
            <ReactQueryDevtools initialIsOpen={false} />
            <TanStackRouterDevtools />
        </>
    );
}
