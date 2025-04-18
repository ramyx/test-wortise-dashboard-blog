import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
            <nav className="px-6 py-8 space-y-8">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Blog</h3>
                    <ul className="mt-2 space-y-2">
                        <li>
                            <Link href="/dashboard/blog/posts" className="block px-4 py-2 hover:bg-gray-100 rounded">
                                Posts
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/blog/new" className="block px-4 py-2 hover:bg-gray-100 rounded">
                                New Post
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    );
}
