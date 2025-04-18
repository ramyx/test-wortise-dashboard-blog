// hooks/useBlog.ts
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type Post = {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

// 1) Lista de posts
export function usePostsQuery() {
    return useQuery<Post[], Error>({
        queryKey: ['posts'],
        queryFn: () => axios.get('/api/blog').then(res => res.data),
    });
}

// 2) Un solo post
export function usePostQuery(id?: string) {
    return useQuery<Post, Error>({
        queryKey: ['post', id],
        queryFn: () => axios.get(`/api/blog/${id}`).then(res => res.data),
        enabled: Boolean(id),
    });
}

// 3) Crear post
export function useCreatePostMutation() {
    const qc = useQueryClient();
    return useMutation<Post, Error, { title: string; content: string }>({
        mutationFn: (data) => axios.post('/api/blog', data).then(res => res.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

// 4) Actualizar post
export function useUpdatePostMutation(id?: string) {
    const qc = useQueryClient();
    return useMutation<Post, Error, { title: string; content: string }>({
        mutationFn: (data) => axios.put(`/api/blog/${id}`, data).then(res => res.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['posts'] });
            if (id) qc.invalidateQueries({ queryKey: ['post', id] });
        },
    });
}

// 5) Borrar post
export function useDeletePostMutation() {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: (id) => axios.delete(`/api/blog/${id}`).then(() => { }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}
