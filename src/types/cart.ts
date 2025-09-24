import { Product } from './product';

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDelivery: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxDiscount?: number;
}

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