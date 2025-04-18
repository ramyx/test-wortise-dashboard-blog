import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePostQuery } from '@/hooks/useBlog';
import Link from 'next/link';

export default function ViewPostPage() {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const { data: post, isLoading, error } = usePostQuery(id);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-full">
                    <span className="loading text-2xl" style={{ color: 'var(--paynes-gray)' }} />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !post) {
        return (
            <DashboardLayout>
                <p className="text-center text-red-600">Error: {error?.message ?? 'Post no encontrado.'}</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-3xl mx-auto">
                {post.coverImage && (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded"
                    />
                )}
                <h1 className="text-4xl font-bold" style={{ color: 'var(--paynes-gray)' }}>
                    {post.title}
                </h1>
                <p className="text-sm" style={{ color: 'var(--chamoisee)' }}>
                    Autor: {post.author.name}
                </p>
                <p className="text-sm mb-4" style={{ color: 'var(--cadet-gray)' }}>
                    Creado: {new Date(post.createdAt).toLocaleString()}
                </p>
                <div className="prose">
                    <p style={{ whiteSpace: 'pre-wrap', color: 'var(--foreground)' }}>
                        {post.content}
                    </p>
                </div>

                <div className="flex space-x-4 mt-6">
                    <Link
                        href={`/dashboard/blog/${post._id}/edit`}
                        className="btn"
                        style={{ backgroundColor: 'var(--earth-yellow)', color: 'var(--paynes-gray)' }}
                    >
                        Editar
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
