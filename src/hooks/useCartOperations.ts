import { useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { Product } from '../types/product';
import { CartItem, CartVariant, Coupon } from '../types/cart';

export const useCartOperations = () => {
  const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
    state
  } = useCart();
  const { showSuccess, showError, showWarning } = useUI();

  const addProductToCart = useCallback((
    product: Product,
    quantity: number = 1,
    variant?: CartVariant
  ) => {
    if (product.stock < quantity) {
      showError('Not enough stock available');
      return false;
    }

    const cartItem: CartItem = {
      id: `${product.id}-${variant?.color || ''}-${variant?.size || ''}-${Date.now()}`,
      product,
      quantity,
      variant,
    };

    try {
      addToCart(cartItem);
      showSuccess(`${product.name} added to cart`);
      return true;
    } catch {
      showError('Failed to add item to cart');
      return false;
    }
  }, [addToCart, showSuccess, showError]);

  const removeProductFromCart = useCallback((itemId: string, productName?: string) => {
    try {
      removeFromCart(itemId);
      showSuccess(`${productName || 'Item'} removed from cart`);
      return true;
    } catch {
      showError('Failed to remove item from cart');
      return false;
    }
  }, [removeFromCart, showSuccess, showError]);

  const updateCartItemQuantity = useCallback((
    itemId: string,
    newQuantity: number,
    productName?: string
  ) => {
    if (newQuantity < 0) {
      showWarning('Quantity cannot be negative');
      return false;
    }

    if (newQuantity === 0) {
      return removeProductFromCart(itemId, productName);
    }

    try {
      updateQuantity(itemId, newQuantity);
      return true;
    } catch {
      showError('Failed to update quantity');
      return false;
    }
  }, [updateQuantity, removeProductFromCart, showWarning, showError]);

  const incrementQuantity = useCallback((itemId: string) => {
    const item = state.items.find(item => item.id === itemId);
    if (!item) return false;

    if (item.product.stock <= item.quantity) {
      showWarning('Maximum stock reached');
      return false;
    }

    return updateCartItemQuantity(itemId, item.quantity + 1);
  }, [state.items, updateCartItemQuantity, showWarning]);

  const decrementQuantity = useCallback((itemId: string) => {
    const item = state.items.find(item => item.id === itemId);
    if (!item) return false;

    return updateCartItemQuantity(itemId, item.quantity - 1, item.product.name);
  }, [state.items, updateCartItemQuantity]);

  const clearCartWithConfirmation = useCallback(() => {
    if (state.items.length === 0) {
      showWarning('Cart is already empty');
      return false;
    }

    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        clearCart();
        showSuccess('Cart cleared successfully');
        return true;
      } catch {
        showError('Failed to clear cart');
        return false;
      }
    }
    return false;
  }, [clearCart, state.items.length, showSuccess, showError, showWarning]);

  const getItemQuantityInCart = useCallback((
    productId: string,
    variant?: CartVariant
  ) => {
    const item = getCartItem(productId, variant);
    return item ? item.quantity : 0;
  }, [getCartItem]);

  const canAddMoreToCart = useCallback((
    productId: string,
    variant?: CartVariant,
    additionalQuantity: number = 1
  ) => {
    const item = getCartItem(productId, variant);
    const currentQuantity = item ? item.quantity : 0;
    const product = item?.product;

    if (!product) {
      // If product not in cart, we need to check stock differently
      // This would require product data to be passed or fetched
      return true;
    }

    return (currentQuantity + additionalQuantity) <= product.stock;
  }, [getCartItem]);

  const getCartSummary = useCallback(() => {
    const itemCount = state.totalItems;
    const subtotal = state.items.reduce((total, item) =>
      total + (item.product.price * item.quantity), 0
    );
    const discount = state.appliedCoupon ? calculateDiscount(subtotal, state.appliedCoupon) : 0;
    const tax = state.estimatedTax;
    const shipping = state.estimatedShipping;
    const total = state.totalPrice;

    return {
      itemCount,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      hasItems: itemCount > 0,
      hasCoupon: !!state.appliedCoupon,
      couponCode: state.appliedCoupon?.code,
      shippingMethod: state.shippingMethod?.name,
    };
  }, [state]);

  return {
    // Basic operations
    addProductToCart,
    removeProductFromCart,
    updateCartItemQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCartWithConfirmation,

    // Utility functions
    isInCart,
    getItemQuantityInCart,
    canAddMoreToCart,
    getCartSummary,

    // State
    cartState: state,
    isLoading: state.isLoading,
    error: state.error,
    isEmpty: state.items.length === 0,
  };
};

// Helper function to calculate discount
const calculateDiscount = (subtotal: number, coupon: Coupon) => {
  if (coupon.type === 'percentage') {
    let discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
    return discount;
  } else {
    return coupon.value;
  }
};

export default useCartOperations;
