import { CartItem } from './cart';

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  appliedCoupon?: Coupon;
  shippingMethod?: ShippingMethod;
  estimatedTax: number;
  estimatedShipping: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiresAt?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isDefault: boolean;
}

export type CartAction =
  | { type: 'CART_LOADING'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'SET_SHIPPING_METHOD'; payload: ShippingMethod }
  | { type: 'UPDATE_TOTALS' }
  | { type: 'CART_ERROR'; payload: string }
  | { type: 'CLEAR_CART_ERROR' }
  | { type: 'RESTORE_CART'; payload: CartItem[] };

export interface AppState {
  cart: CartState;
  ui: UIState;
}

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchQuery: string;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type UIAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };
