export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  images: string[];
  inStock: boolean;
  featured: boolean;
  categories: string[];
  tags: string[];
  sku?: string;
  // Legacy fields for backward compatibility
  image?: string;
  brand?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  discount?: number;
  stock?: number;
}
