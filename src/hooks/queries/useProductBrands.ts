import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

const fetchProductBrands = async (): Promise<string[]> => {
  return apiClient.get('/products/brands');
};

export const useProductBrands = () => {
  return useQuery<string[], Error>({
    queryKey: ['productBrands'],
    queryFn: fetchProductBrands,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
