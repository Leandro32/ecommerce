
import { Card, CardBody, CardHeader, Divider, Image, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import StatusBadge from '../../../../../src/admin/components/StatusBadge';
import StatusUpdater from '../../../../../src/admin/components/StatusUpdater';
import InternalNotes from '../../../../../src/admin/components/InternalNotes';
import { Order } from '../../../../../src/types/order';

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
              <Table aria-label="Order items table">
                <TableHeader>
                  <TableColumn>Product</TableColumn>
                  <TableColumn>Quantity</TableColumn>
                  <TableColumn>Price</TableColumn>
                  <TableColumn>Total</TableColumn>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
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
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Update Status</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <StatusUpdater orderId={order.id} currentStatus={order.status} onStatusUpdate={() => { /* Revalidate data */ }} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Internal Notes</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <InternalNotes orderId={order.id} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
