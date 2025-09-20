import React from 'react';
import { Button, Card, CardBody, Badge } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Order } from '../types/order';

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const generateWhatsAppMessage = (order: Order) => {
    if (!order) return '';

    const itemsText = order.items.map(item =>
      `• ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `Hola, buen dia!\nQuiero comprar estos productos:\n\n${itemsText}\n\n💰 *Total: $${order.total.toFixed(2)}*\n\nMuchas gracias!`;
    return encodeURIComponent(message);
  };

  const WHATSAPP_NUMBER = '1234567890'; // Placeholder

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="border border-divider">
            <CardBody>
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Order #{order.id.slice(0, 8)}</h4>
                  </div>
                  <p className="text-sm text-default-500">
                    Placed on {new Date(order.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • ${order.total.toFixed(2)}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <Button
                    as="a"
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppMessage(order)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    color="success"
                    startContent={<Icon icon="logos:whatsapp-icon" />}
                  >
                    Resend on WhatsApp
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
