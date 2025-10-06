'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Input } from '@heroui/react';
import { useRouter } from 'next/navigation';
import LineItemBuilder from '../../../../src/admin/components/LineItemBuilder';
import { addToast } from '@heroui/react';

interface OrderItemPayload {
  productId: string;
  quantity: number;
}

interface OrderPayload {
  customerName: string;
  items: OrderItemPayload[];
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [selectedItems, setSelectedItems] = useState<OrderItemPayload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleItemsChange = (items: any[]) => {
    setSelectedItems(items.map(item => ({ productId: item.productId, quantity: item.quantity })));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!customerName.trim()) {
        throw new Error('Customer name is required.');
      }
      if (selectedItems.length === 0) {
        throw new Error('Order must contain at least one item.');
      }

      const orderPayload: OrderPayload = {
        customerName,
        items: selectedItems,
      };

      const res = await fetch('/api/v1/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const newOrder = await res.json();
      addToast({
        title: 'Success',
        description: `Order #${newOrder.id} created successfully.`, 
        color: 'success',
      });
      router.push(`/admin/orders/${newOrder.id}`);
    } catch (error: any) {
      addToast({
        title: 'Error',
        description: error.message || 'Failed to create order.',
        color: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Order</h1>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Customer Information</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Input
            label="Customer Name"
            placeholder="Enter customer name"
            value={customerName}
            onValueChange={setCustomerName}
            className="max-w-md"
          />
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Order Items</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <LineItemBuilder onItemsChange={handleItemsChange} />
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button
          color="primary"
          size="lg"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          isDisabled={!customerName.trim() || selectedItems.length === 0}
        >
          Create Order
        </Button>
      </div>
    </div>
  );
}
