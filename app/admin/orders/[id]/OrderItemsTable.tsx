'use client';

import { Image, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { Order } from '@/types/order';

interface OrderItemsTableProps {
  items: Order['items'];
}

export default function OrderItemsTable({ items }: OrderItemsTableProps) {
  return (
    <Table aria-label="Order items table">
      <TableHeader>
        <TableColumn>Product</TableColumn>
        <TableColumn>Quantity</TableColumn>
        <TableColumn>Price</TableColumn>
        <TableColumn>Total</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Image
                  src={item.product?.imageUrl || '/placeholder-product.svg'}
                  alt={item.product?.name || 'Product Image'}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
                <span>{item.product?.name || 'N/A'}</span>
              </div>
            </TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>${item.product?.price.toFixed(2) || '0.00'}</TableCell>
            <TableCell>${((item.product?.price || 0) * item.quantity).toFixed(2)}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
