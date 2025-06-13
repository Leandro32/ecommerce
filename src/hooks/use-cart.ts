import React from "react";
import { useCart as useCartContext } from "../context/CartContext";
import { useUI } from "../context/UIContext";
import { CartItem } from "../types/cart";
import { Product } from "../types/product";

export const useCart = () => {
  const {
    state,
    addToCart: addToCartContext,
    removeFromCart: removeFromCartContext,
    updateQuantity,
    clearCart: clearCartContext,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem,
  } = useCartContext();

  const { showSuccess, showError } = useUI();

  // Legacy API compatibility
  const addToCart = (
    product: Product,
    quantity = 1,
    variant?: { color?: string; size?: string },
  ) => {
    try {
      if (product.stock < quantity) {
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
    } catch (error) {
      showError("Failed to add item to cart");
    }
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    try {
      updateQuantity(itemId, quantity);
    } catch (error) {
      showError("Failed to update quantity");
    }
  };

  const removeFromCart = (itemId: string) => {
    try {
      const item = state.items.find((item) => item.id === itemId);
      removeFromCartContext(itemId);
      if (item) {
        showSuccess(`${item.product.name} removed from cart`);
      }
    } catch (error) {
      showError("Failed to remove item from cart");
    }
  };

  const clearCart = () => {
    try {
      if (state.items.length === 0) {
        showError("Cart is already empty");
        return;
      }
      clearCartContext();
      showSuccess("Cart cleared successfully");
    } catch (error) {
      showError("Failed to clear cart");
    }
  };

  // Computed values for backward compatibility
  const cartItems = React.useMemo(() => state.items, [state.items]);

  const cartTotal = React.useMemo(() => {
    // For legacy compatibility, return subtotal without tax/shipping
    return state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }, [state.items]);

  const cartOriginalTotal = React.useMemo(() => {
    return state.items.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      return total + originalPrice * item.quantity;
    }, 0);
  }, [state.items]);

  const cartSavings = React.useMemo(() => {
    return cartOriginalTotal - cartTotal;
  }, [cartOriginalTotal, cartTotal]);

  const totalItems = React.useMemo(() => {
    return state.totalItems;
  }, [state.totalItems]);

  const subtotal = React.useMemo(() => {
    return state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }, [state.items]);

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

    // New enhanced API
    state,
    items: state.items,
    totalItems,
    subtotal,
    totalPrice: state.totalPrice,
    isLoading: state.isLoading,
    error: state.error,
    appliedCoupon: state.appliedCoupon,
    shippingMethod: state.shippingMethod,
    estimatedTax: state.estimatedTax,
    estimatedShipping: state.estimatedShipping,

    // Utility functions
    isInCart,
    getCartItem,
    getCartTotal,
    getCartItemsCount,

    // Computed flags
    isEmpty: state.items.length === 0,
    hasItems: state.items.length > 0,
    hasCoupon: !!state.appliedCoupon,
    hasShipping: !!state.shippingMethod,
  };
};
