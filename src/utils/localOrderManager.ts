import { Order } from '@/types/order';

const generateShortId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const saveOrderToLocalStorage = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order => {
  const newOrder: Order = {
    ...order,
    id: generateShortId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'pending_whatsapp_confirmation',
  };

  const existingOrders = getOrdersFromLocalStorage();
  const updatedOrders = [newOrder, ...existingOrders];

  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  return newOrder;
};

export const getOrdersFromLocalStorage = (): Order[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const ordersJson = localStorage.getItem('orders');
  return ordersJson ? JSON.parse(ordersJson) : [];
};