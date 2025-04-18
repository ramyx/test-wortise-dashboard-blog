import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePostQuery, useUpdatePostMutation } from '@/hooks/useBlog';
import { authClient } from '@/lib/auth-client';
import { useEffect } from 'react';

interface FormInputs {
    title: string;
    content: string;
    coverImage?: string;
    author: string;
    createdAt: string;
}

export default function EditPostPage() {
    const router = useRouter();
    const { id } = router.query as { id: string };

    // RQ: obtener el post existente
    const { data: post, isLoading: isFetching, error } = usePostQuery(id);
    const updatePost = useUpdatePostMutation(id);

    // auth session para autor (fallback)
    const { data: session } = authClient.useSession();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormInputs>();

    // Resetear valores cuando post o sesión cambien
    useEffect(() => {
        if (post) {
            reset({
                title: post.title,
                content: post.content,
                coverImage: (post as any).coverImage ?? '',
                author: post.author ?? session?.user?.name ?? '',
                createdAt: new Date(post.createdAt).toISOString().split('T')[0]
            });
        }
    }, [post, reset, session]);

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
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

                {/* Autor */}
                <div>
                    <label className="block mb-1 text-lg font-medium">Autor</label>
                    <input
                        {...register('author', { required: true })}
                        className="input input-bordered w-full"
                        readOnly
                    />
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