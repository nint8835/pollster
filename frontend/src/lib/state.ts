import type { DiscordUser } from '@/queries/api/pollsterSchemas';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
    user: DiscordUser;
    setUser: (user: DiscordUser) => void;
}

export const useStore = create<State>()(
    devtools((set) => ({
        user: { id: '', username: '', is_owner: false },
        setUser: (user) => set({ user }, false, 'setUser'),
    })),
);
