import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PostInput, useCreatePostMutation } from '@/hooks/useBlog';
import { authClient } from '@/lib/auth-client';
import { useEffect } from 'react';

interface FormInputs {
    title: string;
    content: string;
    coverImage: string;
    author: string;
    createdAt: string;
}

export default function NewPostPage() {
    const router = useRouter();
    const createPost = useCreatePostMutation();

    // Obtenemos autor desde sesión
    const { data: session } = authClient.useSession();

    // Valores por defecto para fecha
    const defaultDate = new Date().toISOString().split('T')[0];

    const { register, handleSubmit, setValue } = useForm<PostInput>({
        defaultValues: { author: session?.user?.id ?? '', createdAt: defaultDate },
    });

    useEffect(() => {
        if (session?.user?.id) {
            setValue('author', session.user.id);
        }
    }, [session, setValue]);

    const onSubmit: SubmitHandler<PostInput> = (data) => {
        createPost.mutate(data, {
            onSuccess: () => router.push('/dashboard/blog/posts'),
        });
    };

    return (
        <DashboardLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
                <div>
                    <label className="block mb-1 text-lg font-medium">Título</label>
                    <input
                        {...register('title', { required: true })}
                        className="input input-bordered w-full"
                        placeholder="Título del post"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-lg font-medium">Texto</label>
                    <textarea
                        {...register('content', { required: true })}
                        className="textarea textarea-bordered w-full h-32"
                        placeholder="Contenido del post"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-lg font-medium">Imagen de portada (URL)</label>
                    <input
                        {...register('coverImage')}
                        className="input input-bordered w-full"
                        placeholder="https://..."
                    />
                </div>

                {/* Campo autor oculto, se asigna en onSubmit */}
                <input type="hidden" {...register('author')} />

                <input
                    type="hidden"
                    {...register('createdAt')}
                />

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
