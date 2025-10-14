import React, { useState } from 'react';
import { Button, Input, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

interface InlineStockEditorProps {
  productId: string;
  initialStock: number;
}

const updateStock = async ({ productId, stock }: { productId: string; stock: number }) => {
  return apiClient.put(`/admin/products/${productId}/stock`, { stock });
};

export const InlineStockEditor: React.FC<InlineStockEditorProps> = ({ productId, initialStock }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [stock, setStock] = useState(initialStock);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(updateStock, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setIsEditing(false);
    },
    onError: () => {
      // Here you would show an error toast
      console.error("Failed to update stock");
    },
  });

  const handleSave = () => {
    mutate({ productId, stock });
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={stock.toString()}
          onValueChange={(val) => setStock(Number(val))}
          className="w-20"
          size="sm"
        />
        <Button isIconOnly size="sm" variant="flat" color="success" onPress={handleSave} isLoading={isLoading}>
          <Icon icon="lucide:check" />
        </Button>
        <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => setIsEditing(false)}>
          <Icon icon="lucide:x" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span>{initialStock}</span>
      <Button isIconOnly size="sm" variant="light" className="opacity-0 group-hover:opacity-100" onPress={() => setIsEditing(true)}>
        <Icon icon="lucide:edit-2" className="text-xs" />
      </Button>
    </div>
  );
};
