import DashboardLayout from '@/components/DashboardLayout';
import { usePostsQuery, useDeletePostMutation } from '@/hooks/useBlog';

export default function PostsPage() {
  const { data: posts, isLoading } = usePostsQuery();
  const deletePost = useDeletePostMutation();

  if (isLoading) return <div>Cargando...</div>;

  return (
    <DashboardLayout>
      {/* ... encabezado, botón New Post */}
      <ul>
        {posts?.map(post => (
          <li key={post._id}>
            {post.title}
            <button onClick={() => deletePost.mutate(post._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </DashboardLayout>
  );
}
