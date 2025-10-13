'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Product } from '@/types/product';
import { addToast } from '@heroui/react';

// Optimistic Update for Deleting a Product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({ 
    mutationFn: (productId: string) => apiClient.delete(`/api/v1/admin/products/${productId}`),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);
      queryClient.setQueryData<Product[]>(['products'], (old) => old?.filter(p => p.id !== productId));
      addToast({ title: 'Deleting...', description: 'Product is being deleted.', color: 'default' });
      return { previousProducts };
    },
    onError: (err, vars, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      addToast({ title: 'Error', description: 'Failed to delete product.', color: 'danger' });
    },
    onSuccess: () => {
      addToast({ title: 'Success', description: 'Product deleted successfully.', color: 'success' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Optimistic Update for Updating a Product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, Product>({
    mutationFn: (updatedProduct: Product) => apiClient.put(`/api/v1/admin/products/${updatedProduct.id}`, updatedProduct),
    onMutate: async (updatedProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['product', updatedProduct.id] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);
      const previousProduct = queryClient.getQueryData<Product>(['product', updatedProduct.id]);

      // Optimistically update the list
      queryClient.setQueryData<Product[]>(['products'], (old) => 
        old?.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      // Optimistically update the detail view
      queryClient.setQueryData<Product>(['product', updatedProduct.id], updatedProduct);

      addToast({ title: 'Updating...', description: 'Product is being updated.', color: 'default' });
      return { previousProducts, previousProduct };
    },
    onError: (err, updatedProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(['product', updatedProduct.id], context.previousProduct);
      }
      addToast({ title: 'Error', description: 'Failed to update product.', color: 'danger' });
    },
    onSuccess: () => {
      addToast({ title: 'Success', description: 'Product updated successfully.', color: 'success' });
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      }
    },
  });
};

// Standard mutation for Creating a Product (no optimistic update needed)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, Omit<Product, 'id'>>({
    mutationFn: (newProduct) => apiClient.post('/api/v1/admin/products', newProduct),
    onSuccess: () => {
      addToast({ title: 'Success', description: 'Product created successfully.', color: 'success' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      addToast({ title: 'Error', description: error.message || 'Failed to create product.', color: 'danger' });
    }
  });
};
