import { ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/router';

interface HeaderProps {
    title?: string;
    children?: ReactNode;
}

export default function Header({ title = 'Dashboard', children }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/signin');
    };

    return (
        <header
            className="flex items-center justify-between px-6 h-16"
            style={{
                backgroundColor: 'var(--paynes-gray)',
                borderBottom: '2px solid var(--cadet-gray)',
            }}
        >
            <h1
                className="text-xl font-semibold"
                style={{ color: 'var(--dun)' }}
            >
                {title}
            </h1>
            <div className="flex items-center space-x-4">
                {children}
                <button
                    onClick={handleLogout}
                    className="px-3 py-1 rounded hover:opacity-90"
                    style={{
                        backgroundColor: 'var(--earth-yellow)',
                        color: 'var(--paynes-gray)',
                    }}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
