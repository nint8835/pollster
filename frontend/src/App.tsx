import { useStore } from '@/lib/state';
import { useGetCurrentUser } from '@/queries/api/pollsterComponents';
import { queryClient } from '@/queries/client';
import { HomeRoute } from '@/routes/Home';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import type { DiscordUser } from './queries/api/pollsterSchemas';

function RequireAuthed({ children }: { children: React.ReactNode }) {
    const { data: currentUser, isFetched } = useGetCurrentUser({});
    const setUser = useStore((state) => state.setUser);

    useEffect(() => {
        if (isFetched && !currentUser) {
            window.location.href = '/auth/login';
        }

        setUser(currentUser as DiscordUser);
    }, [isFetched, currentUser]);

    // TODO: Loading indicator?
    return isFetched && currentUser ? <>{children}</> : null;
}
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RequireAuthed>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<HomeRoute />} />
                    </Routes>
                </BrowserRouter>
            </RequireAuthed>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
