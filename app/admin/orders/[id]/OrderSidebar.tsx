'use client';

import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import StatusUpdater from '@/admin/components/StatusUpdater';
import InternalNotes from '@/admin/components/InternalNotes';
import { Order } from '@/types/order';

interface OrderSidebarProps {
  order: Order;
}

export default function OrderSidebar({ order }: OrderSidebarProps) {
  return (
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
  );
}
