
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { apiClient } from '@/lib/apiClient';

interface ProductFilters {
  brands?: string[];
  sex?: string[];
  bottleSize?: number[];
  page?: number;
  limit?: number;
  query?: string;
}

const fetchProducts = async (filters: ProductFilters): Promise<{ products: Product[], totalPages: number }> => {
  const params = new URLSearchParams();

  if (filters.brands && filters.brands.length > 0) {
    params.append('brands', filters.brands.join(','));
  }
  if (filters.sex && filters.sex.length > 0) {
    params.append('sex', filters.sex.join(','));
  }
  if (filters.bottleSize && filters.bottleSize.length > 0) {
    params.append('bottleSize', filters.bottleSize.join(','));
  }
  if (filters.page) {
    params.append('page', filters.page.toString());
  }
  if (filters.limit) {
    params.append('limit', filters.limit.toString());
  }
  if (filters.query) {
    params.append('query', filters.query);
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/api/v1/products?${queryString}` : '/api/v1/products';

  return apiClient.get(endpoint);
};

export const useProducts = (filters: ProductFilters) => {
  return useQuery<{ products: Product[], totalPages: number }, Error>({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    keepPreviousData: true,
  });
};
