import DashboardLayout from '@/components/DashboardLayout';
import { useForm } from 'react-hook-form';
import { useCreatePostMutation } from '@/hooks/useBlog';

export default function NewPostPage() {
    const { register, handleSubmit } = useForm<{ title: string; content: string }>();
    const createPost = useCreatePostMutation();

    const onSubmit = handleSubmit(data => createPost.mutate(data));

    return (
        <DashboardLayout>
            <form onSubmit={onSubmit}>
                {/* campos title, content */}
                <button type="submit" disabled={createPost.isPending}>
                    {createPost.isPending ? 'Guardando...' : 'Guardar'}
                </button>
            </form>
        </DashboardLayout>
    );
}
