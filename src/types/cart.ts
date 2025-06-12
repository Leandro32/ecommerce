import { Product } from './product';

export interface CartVariant {
  color?: string;
  size?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: CartVariant;
}