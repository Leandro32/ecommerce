'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Product } from '@/types/product';

export const useProducts = () => {
  return useQuery<{ data: Product[] }, Error, Product[]>({
    queryKey: ['products'],
    queryFn: () => apiClient.get('/api/v1/products'),
    select: (response) => response.data,
  });
};
