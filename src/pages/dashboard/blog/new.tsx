import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCreatePostMutation } from '@/hooks/useBlog';
import { authClient } from '@/lib/auth-client';
import { postSchema } from '@/schemas/postSchema';
import { z } from 'zod';

export type PostInput = z.infer<typeof postSchema>;

export default function NewPostPage() {
    const router = useRouter();
    const createPost = useCreatePostMutation();
    const { data: session } = authClient.useSession();

    const defaultDate = new Date().toISOString().split('T')[0];

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<PostInput>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            author: session?.user?.id ?? '',
            createdAt: defaultDate,
            coverImage: ''
        }
    });

    // Asignamos el author desde la sesión cuando esté disponible
    useEffect(() => {
        if (session?.user?.id) setValue('author', session.user.id);
    }, [session, setValue]);

    const onSubmit: SubmitHandler<PostInput> = (data) => {
        createPost.mutate(data, {
            onSuccess: () => router.push('/dashboard/blog/posts'),
        });
    };

    return (
        <DashboardLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">

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
                    {errors.coverImage && (
                        <p className="text-sm text-error mt-1">{errors.coverImage.message}</p>
                    )}
                </div>

                {/* Campos ocultos */}
                <input type="hidden" {...register('author')} />
                <input type="hidden" {...register('createdAt')} />

                {/* Botón de envío */}
                <button
                    type="submit"
                    disabled={createPost.isPending}
                    className="btn btn-primary w-full"
                >
                    {createPost.isPending ? 'Guardando...' : 'Guardar'}
                </button>
            </form>
        </DashboardLayout>
    );
}
