import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCreatePostMutation } from '@/hooks/useBlog';
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

    // Valores por defecto para autor y fecha
    const defaultAuthor = session?.user?.name ?? '';
    const defaultDate = new Date().toISOString().split('T')[0];

    const { register, handleSubmit, setValue } = useForm<FormInputs>({
        defaultValues: {
            author: defaultAuthor,
            createdAt: defaultDate,
        }
    });

    // Si cambia sesión, actualizamos autor
    useEffect(() => {
        if (session?.user?.name) {
            setValue('author', session.user.name);
        }
    }, [session, setValue]);

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
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

                <div>
                    <label className="block mb-1 text-lg font-medium">Autor</label>
                    <input
                        {...register('author', { required: true })}
                        className="input input-bordered w-full"
                        readOnly
                    />
                </div>

                <div>
                    <label className="block mb-1 text-lg font-medium">Fecha de creación</label>
                    <input
                        type="date"
                        {...register('createdAt', { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

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
