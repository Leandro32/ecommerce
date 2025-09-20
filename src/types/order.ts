import { CartItem } from './cart';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  status: 'pending_whatsapp_confirmation' | 'confirmed' | 'cancelled';
}
