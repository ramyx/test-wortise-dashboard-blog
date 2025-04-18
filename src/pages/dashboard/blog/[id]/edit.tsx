import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePostQuery, useUpdatePostMutation, PostInput } from '@/hooks/useBlog';
import { useEffect } from 'react';

export default function EditPostPage() {
    const router = useRouter();
    const { id } = router.query as { id: string };

    const { data: post, isPending: isFetching, error } = usePostQuery(id);
    const updatePost = useUpdatePostMutation(id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<PostInput>();

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

    if (isFetching) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full">
                    <span className="loading text-2xl" style={{ color: 'var(--paynes-gray)' }} />
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
                <h1 className="text-2xl font-bold text-center" style={{ color: 'var(--paynes-gray)' }}>
                    Editar Post
                </h1>

                {/* Título */}
                <div>
                    <label className="block mb-1 text-lg font-medium">Título</label>
                    <input
                        {...register('title', { required: true })}
                        className="input input-bordered w-full"
                    />
                    {errors.title && <p className="text-sm text-red-600">Este campo es obligatorio</p>}
                </div>

                {/* Texto */}
                <div>
                    <label className="block mb-1 text-lg font-medium">Texto</label>
                    <textarea
                        {...register('content', { required: true })}
                        className="textarea textarea-bordered w-full h-32"
                    />
                    {errors.content && <p className="text-sm text-red-600">Este campo es obligatorio</p>}
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

                {/* Autor mostrando nombre */}
                <div>
                    <label className="block mb-1 text-lg font-medium">Autor</label>
                    <p className="input input-bordered w-full bg-gray-200 text-gray-600">
                        {post?.author.name}
                    </p>
                </div>

                {/* Fecha de creación */}
                <div>
                    <label className="block mb-1 text-lg font-medium">Fecha de creación</label>
                    <input
                        type="date"
                        {...register('createdAt', { required: true })}
                        className="input input-bordered w-full"
                    />
                    {errors.createdAt && <p className="text-sm text-red-600">Este campo es obligatorio</p>}
                </div>

                {/* Botón Actualizar */}
                <div>
                    <button
                        type="submit"
                        className={`btn btn-primary w-full ${updatePost.isPending && 'loading'}`}
                        disabled={updatePost.isPending}
                    >
                        {updatePost.isPending ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
