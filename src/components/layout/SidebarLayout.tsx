import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside
            className="w-64 flex flex-col justify-between"
            style={{
                backgroundColor: 'var(--cadet-gray)',
                borderRight: '2px solid var(--paynes-gray)',
            }}
        >
            <nav className="px-6 py-8 space-y-8">
                <div>
                    <h3
                        className="text-sm font-medium uppercase tracking-wide"
                        style={{ color: 'var(--dun)' }}
                    >
                        Blog
                    </h3>
                    <ul className="mt-2 space-y-2">
                        <li>
                            <Link
                                href="/dashboard/blog/posts"
                                className="block px-4 py-2 rounded"
                                style={{
                                    color: 'var(--foreground)',
                                    backgroundColor: 'transparent',
                                }}
                            >
                                Posts
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/blog/new"
                                className="block px-4 py-2 rounded"
                                style={{
                                    color: 'var(--foreground)',
                                    backgroundColor: 'transparent',
                                }}
                            >
                                New Post
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    );
}
