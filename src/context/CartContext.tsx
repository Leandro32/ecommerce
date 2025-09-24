import React, { createContext, useReducer, useEffect, ReactNode, useContext } from 'react';
import { Product } from '../types/product';
import { useUI } from './UIContext';
import { CartItem } from '../types/cart';

// Define CartItem and CartState interfaces
interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: {
    color?: string;
    size?: string;
  };
}

interface CartState {
  items: CartItem[];
  total: number;
  originalTotal: number;
  savings: number;
}

// Define CartContextType
interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number, variant?: { color?: string; size?: string }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
}

// Initial state for the cart
const initialCartState: CartState = {
  items: [],
  total: 0,
  originalTotal: 0,
  savings: 0,
};

// Action types for the reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; variant?: { color?: string; size?: string } } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; newQuantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartState };

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]): { total: number; originalTotal: number; savings: number } => {
  let total = 0;
  let originalTotal = 0;

  items.forEach(item => {
    const price = item.product.salePrice || item.product.price;
    const originalPrice = item.product.originalPrice || item.product.price;
    total += price * item.quantity;
    originalTotal += originalPrice * item.quantity;
  });

  const savings = originalTotal - total;
  return { total, originalTotal, savings };
};

// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1, variant } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id &&
                item.variant?.color === variant?.color &&
                item.variant?.size === variant?.size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        const { total, originalTotal, savings } = calculateTotals(updatedItems);
        return { ...state, items: updatedItems, total, originalTotal, savings };
      } else {
        const updatedItems = [...state.items, { id: product.id, product, quantity, variant }];
        const { total, originalTotal, savings } = calculateTotals(updatedItems);
        return { ...state, items: updatedItems, total, originalTotal, savings };
      }
    }
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const { total, originalTotal, savings } = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, total, originalTotal, savings };
    }
    case 'UPDATE_QUANTITY': {
      const { itemId, newQuantity } = action.payload;
      const updatedItems = state.items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      const { total, originalTotal, savings } = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, total, originalTotal, savings };
    }
    case 'CLEAR_CART':
      return initialCartState;
    case 'SET_CART':
      return action.payload;
    default:
      return state;
  }
};

// Create the context
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Define the storage key
const CART_STORAGE_KEY = 'ecommerce_cart';

// CartProvider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Function to get initial state from localStorage
  const getInitialState = (): CartState => {
    if (typeof window !== 'undefined') { // Guard localStorage access
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart.items && Array.isArray(parsedCart.items)) {
            // Recalculate totals to ensure consistency
            const { total, originalTotal, savings } = calculateTotals(parsedCart.items);
            return { ...parsedCart, total, originalTotal, savings };
          }
        }
      } catch (error) {
        console.error("Failed to load initial cart state:", error);
        localStorage.removeItem(CART_STORAGE_KEY); // Guarded
      }
    }
    return initialCartState;
  };

  const [state, dispatch] = useReducer(cartReducer, initialCartState, getInitialState);

  // Effect to save cart state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') { // Guard localStorage access
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Action creators
  const addToCart = (product: Product, quantity?: number, variant?: { color?: string; size?: string }) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, variant } });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, newQuantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// NEW: useCart hook moved from src/hooks/use-cart.ts
export const useCart = () => {
  const context = useContext(CartContext);
  const { showSuccess, showError } = useUI(); // Assuming useUI is correctly imported and available

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  // Destructure from contextValue
  const {
    items,
    total,
    addToCart: addToCartContext,
    removeFromCart: removeFromCartContext,
    updateQuantity: updateQuantityContext,
    clearCart: clearCartContext,
  } = context;

  // Legacy API compatibility functions
  const addToCart = (
    product: Product,
    quantity = 1,
    variant?: { color?: string; size?: string },
  ) => {
    try {
      // Assuming product.stock is available and correct
      if (product.stock && product.stock < quantity) {
        showError("Not enough stock available");
        return;
      }

      const cartItem: CartItem = {
        id: `${product.id}-${variant?.color || ""}-${variant?.size || ""}-${Date.now()}`,
        product,
        quantity,
        variant,
      };

      addToCartContext(cartItem);
      showSuccess(`${product.name} added to cart`);
    } catch {
      showError("Failed to add item to cart");
    }
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    try {
      updateQuantityContext(itemId, quantity);
    } catch {
      showError("Failed to update quantity");
    }
  };

  const removeFromCart = (itemId: string) => {
    try {
      const item = items.find((item) => item.id === itemId);
      removeFromCartContext(itemId);
      if (item) {
        showSuccess(`${item.product.name} removed from cart`);
      }
    } catch {
      showError("Failed to remove item from cart");
    }
  };

  const clearCart = () => {
    try {
      if (items.length === 0) {
        showError("Cart is already empty");
        return;
      }
      clearCartContext();
      showSuccess("Cart cleared successfully");
    } catch {
      showError("Failed to clear cart");
    }
  };

  // Computed values for backward compatibility
  const cartItems = React.useMemo(() => items, [items]);

  const cartTotal = React.useMemo(() => {
    // For legacy compatibility, return subtotal without tax/shipping
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }, [items]);

  const cartOriginalTotal = React.useMemo(() => {
    return items.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      return total + originalPrice * item.quantity;
    }, 0);
  }, [items]);

  const cartSavings = React.useMemo(() => {
    return cartOriginalTotal - cartTotal;
  }, [cartOriginalTotal, cartTotal]);

  const totalItems = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0); // Corrected calculation
  }, [items]);

  const subtotal = React.useMemo(() => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }, [items]);

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const getCartItem = (productId: string) => {
    return items.find((item) => item.product.id === productId);
  };

  return {
    // Legacy API - keep exact same interface
    cartItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartOriginalTotal,
    cartSavings,

    // New enhanced API (from original use-cart.ts)
    state: context, // Pass the whole context value as state
    items: items,
    totalItems,
    subtotal,
    totalPrice: total,
    isLoading: false, // No loading state in this context
    error: null, // No error state in this context
    appliedCoupon: null, // No coupon state in this context
    shippingMethod: null, // No shipping state in this context
    estimatedTax: 0, // No tax state in this context
    estimatedShipping: 0, // No shipping state in this context

    // Utility functions
    isInCart,
    getCartItem,
    getCartTotal: total,
    getCartItemsCount: totalItems,

    // Computed flags
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
    hasCoupon: false,
    hasShipping: false,
  };
};
