import { format } from 'date-fns';
import { Button, Link as HeroLink, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import Link from 'next/link';
import StatusBadge from '../../../src/admin/components/StatusBadge';
import { Order } from '../../../src/types/order';

async function getOrders(): Promise<Order[]> {
  const res = await fetch('http://localhost:3000/api/v1/admin/orders', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }
  const json = await res.json();
  return json;
}

export default async function OrdersPage() {
  const orders = await getOrders();

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
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell>{order.items.length}</TableCell>
              <TableCell>{format(new Date(order.createdAt), 'PPP p')}</TableCell>
              <TableCell>
                <HeroLink as={Link} href={`/admin/orders/${order.id}`} size="sm">
                  View Details
                </HeroLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
