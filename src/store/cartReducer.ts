import { CartState, CartAction } from '../types/store';
import { CartItem, Coupon, ShippingMethod, CartVariant } from '../types/cart';

export const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
  appliedCoupon: undefined,
  shippingMethod: undefined,
  estimatedTax: 0,
  estimatedShipping: 0,
};

const calculateTotals = (items: CartItem[], appliedCoupon?: Coupon, shippingMethod?: ShippingMethod) => {
  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount) {
        discount = Math.min(discount, appliedCoupon.maxDiscount);
      }
    } else {
      discount = appliedCoupon.value;
    }
  }

  const estimatedTax = (subtotal - discount) * 0.08; // 8% tax rate
  const estimatedShipping = shippingMethod?.price || 0;
  const totalPrice = subtotal - discount + estimatedTax + estimatedShipping;

  return {
    totalItems,
    totalPrice: Math.max(0, totalPrice),
    estimatedTax,
    estimatedShipping,
  };
};

const findItemIndex = (items: CartItem[], productId: string, variant?: CartVariant) => {
  return items.findIndex(item => {
    if (item.product.id !== productId) return false;

    // If no variants, items match
    if (!variant && !item.variant) return true;
    if (!variant || !item.variant) return false;

    // Compare variants
    return (
      item.variant.color === variant.color &&
      item.variant.size === variant.size
    );
  });
};

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'CART_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };

    case 'ADD_TO_CART': {
      const newItem = action.payload;
      const existingIndex = findItemIndex(state.items, newItem.product.id, newItem.variant);

      let updatedItems: CartItem[];

      if (existingIndex >= 0) {
        // Update existing item quantity
        updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, newItem];
      }

      const totals = calculateTotals(updatedItems, state.appliedCoupon, state.shippingMethod);

      return {
        ...state,
        items: updatedItems,
        ...totals,
        error: null,
      };
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(updatedItems, state.appliedCoupon, state.shippingMethod);

      return {
        ...state,
        items: updatedItems,
        ...totals,
        error: null,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const updatedItems = state.items.filter(item => item.id !== id);
        const totals = calculateTotals(updatedItems, state.appliedCoupon, state.shippingMethod);

        return {
          ...state,
          items: updatedItems,
          ...totals,
          error: null,
        };
      }

      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );

      const totals = calculateTotals(updatedItems, state.appliedCoupon, state.shippingMethod);

      return {
        ...state,
        items: updatedItems,
        ...totals,
        error: null,
      };
    }

    case 'CLEAR_CART':
      return {
        ...initialCartState,
      };

    case 'APPLY_COUPON': {
      const coupon = action.payload;
      const subtotal = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

      // Validate coupon
      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        return {
          ...state,
          error: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`,
        };
      }

      const totals = calculateTotals(state.items, coupon, state.shippingMethod);

      return {
        ...state,
        appliedCoupon: coupon,
        ...totals,
        error: null,
      };
    }

    case 'REMOVE_COUPON': {
      const totals = calculateTotals(state.items, undefined, state.shippingMethod);

      return {
        ...state,
        appliedCoupon: undefined,
        ...totals,
        error: null,
      };
    }

    case 'SET_SHIPPING_METHOD': {
      const totals = calculateTotals(state.items, state.appliedCoupon, action.payload);

      return {
        ...state,
        shippingMethod: action.payload,
        ...totals,
        error: null,
      };
    }

    case 'UPDATE_TOTALS': {
      const totals = calculateTotals(state.items, state.appliedCoupon, state.shippingMethod);

      return {
        ...state,
        ...totals,
        error: null,
      };
    }

    case 'CART_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_CART_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'RESTORE_CART': {
      const totals = calculateTotals(action.payload, state.appliedCoupon, state.shippingMethod);

      return {
        ...state,
        items: action.payload,
        ...totals,
        error: null,
        isLoading: false,
      };
    }

    default:
      return state;
  }
};
