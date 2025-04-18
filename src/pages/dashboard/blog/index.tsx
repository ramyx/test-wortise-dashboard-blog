import DashboardLayout from '@/components/DashboardLayout';
import { usePostsQuery } from '@/hooks/useBlog';
import Link from 'next/link';

export default function BlogIndexPage() {
    const { data: posts, isLoading, error } = usePostsQuery();

    if (isLoading) return <DashboardLayout>Cargando...</DashboardLayout>;
    if (error) return <DashboardLayout>Error: {error.message}</DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Posts</h2>
                <Link
                    href="/dashboard/blog/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    New Post
                </Link>
            </div>
            <ul className="space-y-4">
                {posts?.map(post => (
                    <li key={post._id} className="p-4 bg-white rounded shadow">
                        <Link href={`/dashboard/blog/${post._id}/edit`} className="text-xl font-bold hover:underline">
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </DashboardLayout>
    );
}
