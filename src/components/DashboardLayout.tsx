import { ReactNode } from 'react';
import Sidebar from './SidebarLayout';
import Header from './HeaderLayout';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div
            className="flex h-screen"
            style={{ background: 'var(--gradient-top-right)' }}
        >
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main
                    className="flex-1 overflow-y-auto p-6"
                    style={{ backgroundColor: 'var(--dun)' }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
