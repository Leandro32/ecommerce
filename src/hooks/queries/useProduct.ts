'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Product } from '@/types/product';

export const useProduct = (slug: string) => {
  return useQuery<{ data: Product }, Error, Product>({
    queryKey: ['product', slug],
    queryFn: () => apiClient.get(`/api/v1/products/${slug}`),
    select: (response) => response.data,
    enabled: !!slug, // Only run the query if the slug is available
  });
};
