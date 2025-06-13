import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { CartState, CartAction } from "../types/store";
import { CartItem } from "../types/cart";
import { cartReducer, initialCartState } from "../store/cartReducer";

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (couponCode: string) => Promise<void>;
  removeCoupon: () => void;
  setShippingMethod: (method: any) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (productId: string, variant?: any) => boolean;
  getCartItem: (productId: string, variant?: any) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "ecommerce-cart";

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Load initial state from localStorage synchronously
  const getInitialState = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          console.log(
            "CartContext: Loading initial state from localStorage:",
            parsedCart.items,
          );
          return {
            ...initialCartState,
            items: parsedCart.items,
            totalItems: parsedCart.items.reduce(
              (total: number, item: any) => total + item.quantity,
              0,
            ),
            totalPrice: parsedCart.items.reduce(
              (total: number, item: any) =>
                total + item.product.price * item.quantity,
              0,
            ),
          };
        }
      }
    } catch (error) {
      console.error("Failed to load initial cart state:", error);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    return initialCartState;
  };

  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  // Debug: Log state changes
  useEffect(() => {
    console.log("CartContext: State changed:", {
      itemCount: state.items.length,
      totalPrice: state.totalPrice,
      items: state.items.map((item) => ({
        id: item.id,
        name: item.product.name,
        quantity: item.quantity,
      })),
    });
  }, [state]);

  // Update totals when state changes (for cases where we loaded incomplete data)
  useEffect(() => {
    if (state.items.length > 0) {
      dispatch({ type: "UPDATE_TOTALS" });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartData = {
      items: state.items,
      appliedCoupon: state.appliedCoupon,
      shippingMethod: state.shippingMethod,
    };
    console.log("CartContext: Saving cart to localStorage:", cartData);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  }, [state.items, state.appliedCoupon, state.shippingMethod]);

  const addToCart = (item: CartItem) => {
    console.log("CartContext: Adding item to cart:", item);
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (itemId: string) => {
    console.log("CartContext: Removing item from cart:", itemId);
    dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const applyCoupon = async (couponCode: string) => {
    dispatch({ type: "CART_LOADING", payload: true });

    try {
      // Simulate API call to validate coupon
      const response = await fetch(`/api/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: couponCode }),
      });

      if (!response.ok) {
        throw new Error("Invalid coupon code");
      }

      const coupon = await response.json();
      dispatch({ type: "APPLY_COUPON", payload: coupon });
    } catch (error) {
      // For demo purposes, simulate some coupons
      const mockCoupons = {
        SAVE10: {
          id: "1",
          code: "SAVE10",
          type: "percentage" as const,
          value: 10,
          description: "10% off your order",
          minOrderAmount: 50,
        },
        FREESHIP: {
          id: "2",
          code: "FREESHIP",
          type: "fixed" as const,
          value: 0,
          description: "Free shipping",
        },
        WELCOME20: {
          id: "3",
          code: "WELCOME20",
          type: "percentage" as const,
          value: 20,
          description: "20% off for new customers",
          maxDiscount: 50,
        },
      };

      const coupon = mockCoupons[couponCode as keyof typeof mockCoupons];

      if (coupon) {
        dispatch({ type: "APPLY_COUPON", payload: coupon });
      } else {
        dispatch({ type: "CART_ERROR", payload: "Invalid coupon code" });
      }
    } finally {
      dispatch({ type: "CART_LOADING", payload: false });
    }
  };

  const removeCoupon = () => {
    dispatch({ type: "REMOVE_COUPON" });
  };

  const setShippingMethod = (method: any) => {
    dispatch({ type: "SET_SHIPPING_METHOD", payload: method });
  };

  const getCartTotal = () => {
    return state.totalPrice;
  };

  const getCartItemsCount = () => {
    return state.totalItems;
  };

  const isInCart = (productId: string, variant?: any) => {
    return state.items.some((item) => {
      if (item.product.id !== productId) return false;

      if (!variant && !item.variant) return true;
      if (!variant || !item.variant) return false;

      return (
        item.variant.color === variant.color &&
        item.variant.size === variant.size
      );
    });
  };

  const getCartItem = (productId: string, variant?: any) => {
    return state.items.find((item) => {
      if (item.product.id !== productId) return false;

      if (!variant && !item.variant) return true;
      if (!variant || !item.variant) return false;

      return (
        item.variant.color === variant.color &&
        item.variant.size === variant.size
      );
    });
  };

  const value: CartContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    setShippingMethod,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
