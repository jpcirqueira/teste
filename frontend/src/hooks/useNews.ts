import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { News, CreateNewsDTO, UpdateNewsDTO, ListNewsResponse } from '@/types';

// Get all news
export const useNews = (page = 1, limit = 10, enabled = true) => {
  return useQuery<ListNewsResponse>({
    queryKey: ['news', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<ListNewsResponse>('/news', {
        params: { page, limit },
      });
      return response.data;
    },
    enabled,
  });
};

// Get single news by ID
export const useNewsById = (id: string) => {
  return useQuery<News>({
    queryKey: ['news', id],
    queryFn: async () => {
      const response = await apiClient.get<News>(`/news/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run query if id is provided
  });
};

// Create news mutation
export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNewsDTO) => {
      const response = await apiClient.post<News>('/news', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch news list
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

// Update news mutation
export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNewsDTO }) => {
      const response = await apiClient.put<News>(`/news/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific news and list
      queryClient.invalidateQueries({ queryKey: ['news', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

// Delete news mutation
export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/news/${id}`);
    },
    onSuccess: () => {
      // Invalidate news list
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};
