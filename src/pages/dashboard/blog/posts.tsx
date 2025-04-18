import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePostsQuery, useDeletePostMutation } from '@/hooks/useBlog';

export default function PostsPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = usePostsQuery(page, 2);
    const deletePost = useDeletePostMutation();

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-full">
                    <span
                        className="loading text-2xl"
                        style={{ color: 'var(--paynes-gray)' }}
                    />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !data) {
        return (
            <DashboardLayout>
                <p className="text-center text-red-600">Error: {error?.message}</p>
            </DashboardLayout>
        );
    }

    const { posts, totalPages } = data;

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2
                    className="text-3xl font-semibold"
                    style={{ color: 'var(--paynes-gray)' }}
                >
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
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="card shadow-md p-6"
                        style={{ backgroundColor: 'var(--dun)' }}
                    >
                        {post.coverImage && (
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                        )}

                        <h3
                            className="text-2xl font-bold"
                            style={{ color: 'var(--paynes-gray)' }}
                        >
                            {post.title}
                        </h3>
                        <p
                            className="text-sm"
                            style={{ color: 'var(--chamoisee)' }}
                        >
                            Autor: {post.author}
                        </p>
                        <p
                            className="text-sm mb-4"
                            style={{ color: 'var(--cadet-gray)' }}
                        >
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

            {/* Pagination Controls */}
            <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                    className="btn"
                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                    disabled={page === 1}
                >
                    « Anterior
                </button>
                <span className="text-sm" style={{ color: 'var(--paynes-gray)' }}>
                    Página {page} de {totalPages}
                </span>
                <button
                    className="btn"
                    onClick={() => setPage(old => Math.min(old + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Siguiente »
                </button>
            </div>
        </DashboardLayout>
    );
}
