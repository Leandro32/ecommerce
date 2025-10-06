'use client';

import React, { useState } from 'react';
import { Button, Select, SelectItem } from '@heroui/react';
import { OrderStatus } from '../../types/order';
import { addToast } from '@heroui/react';

interface StatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusUpdate: (newStatus: OrderStatus) => void;
}

const statusOptions = Object.values(OrderStatus).map(status => ({
  label: status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()),
  value: status,
}));

const StatusUpdater: React.FC<StatusUpdaterProps> = ({ orderId, currentStatus, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      addToast({
        title: 'Success',
        description: 'Order status updated successfully.',
        color: 'success',
      });
      onStatusUpdate(selectedStatus);
    } catch (error: any) {
      addToast({
        title: 'Error',
        description: error.message || 'Failed to update order status.',
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        aria-label="Select Order Status"
        selectedKeys={[selectedStatus]}
        onSelectionChange={(keys) => {
          const newStatus = Array.from(keys)[0] as OrderStatus;
          setSelectedStatus(newStatus);
        }}
        className="max-w-xs"
        size="sm"
        isDisabled={isLoading}
      >
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
      <Button
        color="primary"
        size="sm"
        onPress={handleSave}
        isLoading={isLoading}
        isDisabled={selectedStatus === currentStatus}
      >
        Save
      </Button>
    </div>
  );
};

export default StatusUpdater;
