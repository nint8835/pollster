import { HeroUIProvider, Link, Navbar, NavbarBrand } from '@heroui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute, redirect } from '@tanstack/react-router';
import type { NavigateOptions, ToOptions } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';

import { TanStackRouterDevtools } from '@/components/util/router-dev-tools';
import '@/index.css';
import { useStore } from '@/lib/state';
import { fetchGetCurrentUser } from '@/queries/api/pollsterComponents';

export const Route = createRootRoute({
  component: Root,
  beforeLoad: async ({ location }) => {
    if (useStore.getState().user.id) {
      return;
    }

    const currentUser = await fetchGetCurrentUser({});
    if (!currentUser) {
      throw redirect({
        to: '/auth/login',
        search: { next: location.href },
        reloadDocument: true,
      });
    }
    useStore.getState().setUser(currentUser);
  },
});

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

function Root() {
  const router = useRouter();

  return (
    <HeroUIProvider
      navigate={(to, options) => router.navigate({ to, ...options })}
      useHref={(to) => router.buildLocation({ to }).href}
    >
      <div className="relative flex h-screen flex-col overflow-auto">
        <Navbar>
          <NavbarBrand>
            <Link href="/" color="foreground">
              <h1 className="text-2xl font-bold">Pollster</h1>
            </Link>
          </NavbarBrand>
        </Navbar>
        <main className="container mx-auto max-w-7xl grow px-6">
          <Outlet />
        </main>
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
    </HeroUIProvider>
  );
}
