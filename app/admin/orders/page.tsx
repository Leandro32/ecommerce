
import { Order } from '../../../../src/types/order';
import OrdersClientPage from './OrdersClientPage';

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

  return <OrdersClientPage orders={orders} />;
}
