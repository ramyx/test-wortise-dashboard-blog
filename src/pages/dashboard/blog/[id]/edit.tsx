import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePostQuery, useUpdatePostMutation } from '@/hooks/useBlog';
import { postSchema } from '@/schemas/postSchema';

export type PostInput = z.infer<typeof postSchema>;

export default function EditPostPage() {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const { data: post, isPending, error } = usePostQuery(id);
    const updatePost = useUpdatePostMutation(id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<PostInput>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: '',
            content: '',
            coverImage: '',
            author: '',
            createdAt: ''
        }
    });

    useEffect(() => {
        if (post) {
            reset({
                title: post.title,
                content: post.content,
                coverImage: post.coverImage || '',
                author: post.author.id,
                createdAt: new Date(post.createdAt).toISOString().split('T')[0]
            });
        }
    }, [post, reset]);

    const onSubmit: SubmitHandler<PostInput> = (data) => {
        updatePost.mutate(data, {
            onSuccess: () => router.push('/dashboard/blog/posts')
        });
    };

    if (isPending) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full">
                    <span className="loading text-2xl" style={{ color: 'var(--jet)' }} />
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold text-center" style={{ color: 'var(--jet)' }}>
                    Editar Post
                </h1>

                {/* Título */}
                <div>
                    <label className="block mb-1 text-lg font-medium">Título</label>
                    <input
                        {...register('title')}
                        className="input input-bordered w-full"
                        placeholder="Título del post"
                    />
                    {errors.title && (
                        <p className="text-sm text-error mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Contenido */}
                <div>
                    <label className="block mb-1 text-lg font-medium">Texto</label>
                    <textarea
                        {...register('content')}
                        className="textarea textarea-bordered w-full h-32"
                        placeholder="Contenido del post"
                    />
                    {errors.content && (
                        <p className="text-sm text-error mt-1">{errors.content.message}</p>
                    )}
                </div>

                {/* Imagen de portada */}
                <div>
                    <label className="block mb-1 text-lg font-medium">Imagen de portada (URL)</label>
                    <input
                        {...register('coverImage')}
                        className="input input-bordered w-full"
                        placeholder="https://..."
                    />
                </div>

                {/* Campos ocultos */}
                <input type="hidden" {...register('author')} />
                <input type="hidden" {...register('createdAt')} />

                {/* Botón Actualizar */}
                <div>
                    <button
                        type="submit"
                        className={`btn btn-primary w-full ${updatePost.isPending ? 'loading' : ''}`}
                        disabled={updatePost.isPending}
                    >
                        {updatePost.isPending ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
