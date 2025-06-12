import React from 'react';
import { addToast } from '@heroui/react';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';

export const useCart = () => {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  
  const addToCart = (product: Product, quantity = 1, variant?: { color?: string; size?: string }) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && 
        item.variant?.color === variant?.color && 
        item.variant?.size === variant?.size
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        
        addToast({
          title: "Cart updated",
          description: `${product.name} quantity updated in your cart.`,
        });
        
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          variant: variant ? { color: variant.color, size: variant.size } : undefined
        };
        
        addToast({
          title: "Added to cart",
          description: `${product.name} added to your cart.`,
        });
        
        return [...prevItems, newItem];
      }
    });
  };
  
  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      
      if (itemToRemove) {
        addToast({
          title: "Item removed",
          description: `${itemToRemove.product.name} removed from your cart.`,
        });
      }
      
      return prevItems.filter(item => item.id !== itemId);
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
    
    addToast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };
  
  const cartTotal = React.useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cartItems]);
  
  const cartOriginalTotal = React.useMemo(() => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      return total + (originalPrice * item.quantity);
    }, 0);
  }, [cartItems]);
  
  const cartSavings = React.useMemo(() => {
    return cartOriginalTotal - cartTotal;
  }, [cartOriginalTotal, cartTotal]);
  
  return {
    cartItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartOriginalTotal,
    cartSavings
  };
};
