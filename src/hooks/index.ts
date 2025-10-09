// Authentication hooks
export { useAuth } from "../admin/context/auth-context";
export { useAuthOperations } from "./useAuthOperations";

// Cart hooks
export { useCart } from "../context/CartContext";
export { useCart as useCartLegacy } from "./use-cart";
export { useCartOperations } from "./useCartOperations";

// UI hooks
export { useUI } from "../context/UIContext";

// Existing hooks
export { useBrands } from "./use-brands";
export { useCategories } from "./use-categories";
export { useFeaturedProducts } from "./use-featured-products";
export { useProduct } from "./use-product";
export { useProducts } from "./use-products";
export { useSearch } from "./use-search";

// Combined hooks for common patterns
import { useAuth } from "../admin/context/auth-context";
import { useCart } from "../context/CartContext";
import { useUI } from "../context/UIContext";

export const useAppState = () => {
  const auth = useAuth();
  const cart = useCart();
  const ui = useUI();

  return {
    auth,
    cart,
    ui,
    isAuthenticated: auth.isAuthenticated,
    cartItemCount: cart.state.totalItems,
    theme: ui.state.theme,
    notifications: ui.state.notifications,
  };
};

// Re-export hook types
export type {
  CartState,
  CartAction,
  UIState,
  UIAction,
  Notification,
} from "../types/store";

export type {
  AuthState,
  AuthAction,
  User,
  LoginCredentials,
  RegisterData,
} from "../types/auth";

export type { CartItem, CartVariant } from "../types/cart";

export type { Product } from "../types/product";
