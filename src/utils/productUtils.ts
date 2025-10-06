import type { Product } from '../types/product';

/**
 * Get display price (sale price if available, otherwise regular price)
 */
export const getDisplayPrice = (product: Product): number => {
  return product.price;
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Get stock status text
 */
export const getStockStatus = (product: Product): { text: string; color: string } => {
  if (product.stock === 0) {
    return { text: 'Out of Stock', color: 'danger' };
  }

  if (product.stock < 5) {
    return { text: 'Low Stock', color: 'warning' };
  }

  return { text: 'In Stock', color: 'success' };
};

/**
 * Filter products by search query
 */
export const filterProductsBySearch = (products: Product[], query: string): Product[] => {
  if (!query.trim()) return products;

  const searchTerm = query.toLowerCase();

  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );
};

/**
 * Sort products by different criteria
 */
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    default:
      return sorted;
  }
};

/**
 * Get price range from products
 */
export const getPriceRange = (products: Product[]): { min: number; max: number } => {
  if (products.length === 0) return { min: 0, max: 1000 };

  const prices = products.map(p => p.price);

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
};