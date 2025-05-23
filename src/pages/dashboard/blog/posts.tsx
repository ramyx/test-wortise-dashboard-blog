import React, { useState, useDeferredValue } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePostsQuery, useDeletePostMutation } from '@/hooks/useBlog';

export default function PostsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const deferredSearch = useDeferredValue(search);
    const deletePost = useDeletePostMutation();

    const { data, isFetching, error } = usePostsQuery(page, 6, deferredSearch);
    const posts = data?.posts || [];
    
    const totalPages = data?.totalPages || 1;

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--jet)' }}>
                    Posts
                </h2>
                <div className="flex space-x-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Buscar título, contenido o autor..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="input input-bordered flex-1"
                    />
                    <Link
                        href="/dashboard/blog/new"
                        className="btn"
                        style={{ backgroundColor: 'var(--sky-magenta)', color: 'white' }}
                    >
                        Nuevo
                    </Link>
                </div>
            </div>

            {error && (
                <p className="text-center text-red-600 mb-4">Error: {error.message}</p>
            )}

            <div className="relative overflow-x-auto">
                {isFetching && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <span className="loading text-2xl" style={{ color: 'var(--jet)' }} />
                    </div>
                )}
                <table className="table w-full text-sm">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Creado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post._id}>
                                <td className="font-medium" style={{ color: 'var(--jet)' }}>
                                    {post.title}
                                </td>
                                <td style={{ color: 'var(--purpureus)' }}>{post.author.name}</td>
                                <td style={{ color: 'var(--lavender-web)' }}>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="space-x-2">
                                    <Link
                                        href={`/dashboard/blog/${post._id}/view`}
                                        className="link"
                                        style={{ color: 'var(--sky-magenta)' }}
                                    >
                                        Ver
                                    </Link>
                                    <Link
                                        href={`/dashboard/blog/${post._id}/edit`}
                                        className="link"
                                        style={{ color: 'var(--sky-magenta)' }}
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => deletePost.mutate(post._id)}
                                        className="link"
                                        style={{ color: 'var(--sky-magenta)' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4 mt-4">
                <button
                    className="btn btn-sm"
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                    disabled={page === 1}
                >
                    «
                </button>
                <span style={{ color: 'var(--jet)' }}>
                    {page} / {totalPages}
                </span>
                <button
                    className="btn btn-sm"
                    onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    »
                </button>
            </div>
        </DashboardLayout>
    );
}