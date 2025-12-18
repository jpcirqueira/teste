import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { HealthCheckResponse } from '@/types';

export const useHealthCheck = () => {
  return useQuery<HealthCheckResponse>({
    queryKey: ['healthCheck'],
    queryFn: async () => {
      const response = await apiClient.get<HealthCheckResponse>('/health');
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
