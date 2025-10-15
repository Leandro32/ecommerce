import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { ProductFilters } from '@/types/product';

const fetchProductBrands = async (filters?: Partial<ProductFilters>): Promise<string[]> => {
  // Ensure filters is an object and remove any undefined or null values
  const validFilters = filters
    ? Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // @ts-ignore
            acc[key] = Array.isArray(value) ? value.join(',') : value;
          }
          return acc;
        },
        {} as Record<string, string>,
      )
    : {};

  const queryParams = new URLSearchParams(validFilters).toString();

  return apiClient.get(`/products/brands?${queryParams}`);
};

export const useProductBrands = (filters?: Partial<ProductFilters>) => {
  return useQuery<string[], Error>({
    queryKey: ['productBrands', filters],
    queryFn: () => fetchProductBrands(filters),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
