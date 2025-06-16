import type { Product as GoogleSheetsProduct } from '../services/googleSheetsService';
import type { Product } from '../types/product';

/**
 * Transform Google Sheets product to be compatible with existing components
 */
export const transformGoogleSheetsProduct = (gsProduct: GoogleSheetsProduct): Product => {
  // Calculate discount percentage if there's a sale price
  const discount = gsProduct.salePrice && gsProduct.originalPrice
    ? Math.round(((gsProduct.originalPrice - gsProduct.salePrice) / gsProduct.originalPrice) * 100)
    : undefined;

  return {
    // Google Sheets fields (primary)
    id: gsProduct.id,
    name: gsProduct.name,
    description: gsProduct.description,
    price: gsProduct.price,
    salePrice: gsProduct.salePrice,
    originalPrice: gsProduct.originalPrice,
    images: gsProduct.images,
    inStock: gsProduct.inStock,
    featured: gsProduct.featured,
    categories: gsProduct.categories,
    tags: gsProduct.tags || [],
    sku: gsProduct.sku,

    // Legacy compatibility fields
    image: gsProduct.images[0] || '', // First image as primary
    brand: gsProduct.tags?.find(tag =>
      ['apple', 'samsung', 'nike', 'adidas', 'sony', 'microsoft'].includes(tag.toLowerCase())
    ), // Try to extract brand from tags
    category: gsProduct.categories[0] || '', // First category as primary
    rating: gsProduct.featured ? 4.5 : Math.random() * 2 + 3, // Mock rating, featured gets higher
    reviewCount: Math.floor(Math.random() * 200) + 1, // Mock review count
    isNew: gsProduct.tags?.some(tag => tag.toLowerCase().includes('new')),
    discount,
    stock: gsProduct.inStock ? Math.floor(Math.random() * 50) + 1 : 0, // Mock stock
  };
};

/**
 * Transform array of Google Sheets products
 */
export const transformGoogleSheetsProducts = (gsProducts: GoogleSheetsProduct[]): Product[] => {
  return gsProducts.map(transformGoogleSheetsProduct);
};

/**
 * Get display price (sale price if available, otherwise regular price)
 */
export const getDisplayPrice = (product: Product): number => {
  return product.salePrice || product.price;
};

/**
 * Check if product has discount
 */
export const hasDiscount = (product: Product): boolean => {
  return !!(product.salePrice && product.salePrice < product.price);
};

/**
 * Get discount percentage
 */
export const getDiscountPercentage = (product: Product): number => {
  if (!hasDiscount(product) || !product.originalPrice) return 0;

  const originalPrice = product.originalPrice || product.price;
  const salePrice = product.salePrice!;

  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
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
  if (!product.inStock || (product.stock !== undefined && product.stock === 0)) {
    return { text: 'Out of Stock', color: 'danger' };
  }

  if (product.stock !== undefined && product.stock < 5) {
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
    product.description.toLowerCase().includes(searchTerm) ||
    product.categories.some(cat => cat.toLowerCase().includes(searchTerm)) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    product.brand?.toLowerCase().includes(searchTerm)
  );
};

/**
 * Sort products by different criteria
 */
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));

    case 'price-desc':
      return sorted.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));

    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'newest':
      // Featured products first, then others
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      });

    default:
      return sorted;
  }
};

/**
 * Get available categories from products
 */
export const getAvailableCategories = (products: Product[]): string[] => {
  const categories = new Set<string>();

  products.forEach(product => {
    product.categories.forEach(category => {
      categories.add(category);
    });
  });

  return Array.from(categories).sort();
};

/**
 * Get available brands from products
 */
export const getAvailableBrands = (products: Product[]): string[] => {
  const brands = new Set<string>();

  products.forEach(product => {
    if (product.brand) {
      brands.add(product.brand);
    }
    // Also check tags for brand names
    product.tags.forEach(tag => {
      if (['apple', 'samsung', 'nike', 'adidas', 'sony', 'microsoft'].includes(tag.toLowerCase())) {
        brands.add(tag);
      }
    });
  });

  return Array.from(brands).sort();
};

/**
 * Get price range from products
 */
export const getPriceRange = (products: Product[]): { min: number; max: number } => {
  if (products.length === 0) return { min: 0, max: 1000 };

  const prices = products.map(getDisplayPrice);

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
};
