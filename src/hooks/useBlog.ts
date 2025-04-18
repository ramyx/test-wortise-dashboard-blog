import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Type definitions
 */
export type Post = {
    _id: string;
    title: string;
    content: string;
    coverImage?: string;
    author: { id: string; name: string };
    createdAt: string;
    updatedAt: string;
};

export type PostInput = {
    title: string;
    content: string;
    coverImage?: string;
    author: string;
    createdAt: string;
};

/**
 * 1) Fetch paginated list of posts with optional search
 */
export function usePostsQuery(
    page = 1,
    limit = 10,
    search = ''
) {
    return useQuery<{
        posts: Post[];
        page: number;
        total: number;
        totalPages: number;
    }, Error>({
        queryKey: ['posts', page, search],
        queryFn: () =>
            axios
                .get('/api/blog', { params: { page, limit, search } })
                .then(res => res.data),
    });
}

/**
 * 2) Fetch a single post by ID
 */
export function usePostQuery(id?: string) {
    return useQuery<Post, Error>({
        queryKey: ['post', id],
        enabled: Boolean(id),
        queryFn: () => axios.get(`/api/blog/${id}`).then(res => res.data),
    });
}

/**
 * 3) Create a new post
 */
export function useCreatePostMutation() {
    const queryClient = useQueryClient();
    return useMutation<Post, Error, PostInput>({
        mutationFn: async (data) => {
            const response = await axios.post('/api/blog', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

/**
 * 4) Update an existing post
 */
export function useUpdatePostMutation(id?: string) {
    const queryClient = useQueryClient();
    return useMutation<Post, Error, PostInput>({
        mutationFn: async (data) => {
            const response = await axios.put(`/api/blog/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['post', id] });
            }
        },
    });
}

/**
 * 5) Delete a post
 */
export function useDeletePostMutation() {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: async (id) => {
            await axios.delete(`/api/blog/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}