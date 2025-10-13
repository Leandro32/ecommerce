
import { Card, CardBody, CardHeader, Divider, Image } from '@heroui/react';
import StatusBadge from '@/admin/components/StatusBadge';
import { Order } from '@/types/order';
import OrderItemsTable from './OrderItemsTable';
import OrderSidebar from './OrderSidebar';

async function getOrder(id: string): Promise<Order> {
  const res = await fetch(`http://localhost:3000/api/v1/admin/orders/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch order');
  }
  const json = await res.json();
  return json;
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Order Details - #{order.id}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Information</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-default-500">Customer Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Order Status</p>
                  <StatusBadge status={order.status} />
                </div>
                <div>
                  <p className="text-sm text-default-500">Created At</p>
                  <p className="font-medium">{new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(order.createdAt))}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Last Updated</p>
                  <p className="font-medium">{new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(order.updatedAt))}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Items</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <OrderItemsTable items={order.items} />
            </CardBody>
          </Card>
        </div>

        <div>
          <OrderSidebar order={order} />
        </div>
      </div>
    </div>
  );
}
