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
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 h-16">
            <h1 className="text-xl font-semibold">{title}</h1>
            <div className="flex items-center space-x-4">
                {children}
                <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
