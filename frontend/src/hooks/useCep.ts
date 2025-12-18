import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Address } from '@/types';

export const useCep = (cep: string) => {
  // Remove non-numeric characters
  const cleanCep = cep.replace(/\D/g, '');

  return useQuery<Address>({
    queryKey: ['cep', cleanCep],
    queryFn: async () => {
      const response = await apiClient.get<Address>(`/cep/${cleanCep}`);
      return response.data;
    },
    enabled: cleanCep.length === 8, // Only query if CEP is valid (8 digits)
    staleTime: 1000 * 60 * 60, // 1 hour (CEP data doesn't change often)
  });
};
