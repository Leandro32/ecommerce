import { Order } from '../types/order';
import { CartItem } from '../types/cart';

const ORDERS_STORAGE_KEY = 'e_commerce_orders';

export const saveOrder = (items: CartItem[], total: number): Order => {
  const newOrder: Order = {
    id: crypto.randomUUID(),
    items,
    total,
    timestamp: Date.now(),
    status: 'pending_whatsapp_confirmation',
  };

  const existingOrders = getOrders();
  const updatedOrders = [...existingOrders, newOrder];

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

  return newOrder;
};

export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const ordersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
  return ordersJson ? JSON.parse(ordersJson) : [];
};

export const getOrder = (id: string): Order | undefined => {
  const orders = getOrders();
  return orders.find(order => order.id === id);
};
