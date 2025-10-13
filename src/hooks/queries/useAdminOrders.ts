'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Order } from '@/types/order';

export const useAdminOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ['admin', 'orders'],
    queryFn: () => apiClient.get('/api/v1/admin/orders'),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
