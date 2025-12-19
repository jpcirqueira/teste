import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { Address } from '@/types';

interface CepApiResponse {
  success: boolean;
  data: Address;
}

export const useCep = (cep: string) => {
  // Remove non-numeric characters
  const cleanCep = cep.replace(/\D/g, '');

  return useQuery<Address>({
    queryKey: ['cep', cleanCep],
    queryFn: async () => {
      const response = await apiClient.get<CepApiResponse>(`/cep/${cleanCep}`);
      
      // Extract data from the API response structure
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Invalid response from API');
    },
    enabled: cleanCep.length === 8, // Only query if CEP is valid (8 digits)
    staleTime: 1000 * 60 * 60, // 1 hour (CEP data doesn't change often)
    retry: 1, // Only retry once on failure
  });
};
