import { useStore } from '@/lib/state';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
    component: Index,
});

function Index() {
    const currentUser = useStore((state) => state.user);
    return (
        <div className="p-2">
            <h3>Welcome {currentUser.username}!</h3>
        </div>
    );
}
