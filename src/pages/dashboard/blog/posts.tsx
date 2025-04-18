import { useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { usePostsQuery, useDeletePostMutation } from '@/hooks/useBlog';

export default function PostsPage() {
    const { data: posts, isLoading, error } = usePostsQuery();
    const deletePost = useDeletePostMutation();

    // Optional: refetch on mount
    useEffect(() => {
        // Could refetch or handle side-effects here
    }, []);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-full">
                    <span className="loading text-2xl" style={{ color: 'var(--paynes-gray)' }}></span>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <p className="text-center text-red-600">Error: {error.message}</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold" style={{ color: 'var(--paynes-gray)' }}>
                    Posts
                </h2>
                <Link
                    href="/dashboard/blog/new"
                    className="btn"
                    style={{ backgroundColor: 'var(--earth-yellow)', color: 'var(--paynes-gray)' }}
                >
                    Nuevo Post
                </Link>
            </div>

            <div className="grid gap-6">
                {posts?.map((post) => (
                    <div
                        key={post._id}
                        className="card shadow-md p-6"
                        style={{ backgroundColor: 'var(--dun)' }}
                    >
                        <h3 className="text-2xl font-bold" style={{ color: 'var(--paynes-gray)' }}>
                            {post.title}
                        </h3>
                        <p className="text-sm mb-4" style={{ color: 'var(--cadet-gray)' }}>
                            Creado: {new Date(post.createdAt).toLocaleString()}
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href={`/dashboard/blog/${post._id}/edit`}
                                className="btn btn-link"
                                style={{ color: 'var(--chamoisee)' }}
                            >
                                Editar
                            </Link>
                            <button
                                onClick={() => deletePost.mutate(post._id)}
                                className="btn btn-error"
                                style={{ backgroundColor: 'var(--earth-yellow)', color: 'var(--paynes-gray)' }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
