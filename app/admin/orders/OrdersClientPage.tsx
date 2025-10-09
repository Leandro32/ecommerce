'use client';

import { Button, Link as HeroLink, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import Link from 'next/link';
import StatusBadge from '../../../src/admin/components/StatusBadge';
import { Order } from '../../../src/types/order';

interface OrdersClientPageProps {
  orders: Order[];
}

export default function OrdersClientPage({ orders }: OrdersClientPageProps) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      <div className="mb-4 text-right">
        <Button as={Link} href="/admin/orders/new" color="primary">
          Create New Order
        </Button>
      </div>

      <Table aria-label="Orders table">
        <TableHeader>
          <TableColumn>Order ID</TableColumn>
          <TableColumn>Customer Name</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Total Items</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody items={orders}>
          {(order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell>{order.items.length}</TableCell>
              <TableCell>{new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(order.createdAt))}</TableCell>
              <TableCell>
                <HeroLink as={Link} href={`/admin/orders/${order.id}`} size="sm">
                  View Details
                </HeroLink>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
