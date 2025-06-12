export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  brand: string;
  category: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  discount?: number;
  tags?: string[];
  stock: number;
  sku?: string;
}