// Create the missing use-featured-products hook
import React from 'react';
import { Product } from '../types/product';

// Mock product data (same as in use-products.ts)
const mockProducts: Product[] = Array.from({ length: 24 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.',
  price: 19.99 + i * 10,
  originalPrice: (i % 3 === 0) ? (19.99 + i * 10) * 1.2 : undefined,
  image: `https://img.heroui.chat/image/${i % 2 === 0 ? 'clothing' : 'fashion'}?w=400&h=600&u=${i + 1}`,
  brand: `Brand ${Math.floor(i / 3) + 1}`,
  category: `Category ${Math.floor(i / 5) + 1}`,
  rating: 3 + Math.floor(Math.random() * 3),
  reviewCount: 10 + Math.floor(Math.random() * 100),
  isNew: i < 8,
  discount: i % 4 === 0 ? 20 : 0,
  stock: 10 + Math.floor(Math.random() * 90),
  sku: `SKU-${1000 + i}`
}));

export const useFeaturedProducts = (type: 'new-arrivals' | 'best-sellers' | 'trending', limit = 8) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredProducts: Product[] = [];
      
      switch (type) {
        case 'new-arrivals':
          filteredProducts = mockProducts.filter(product => product.isNew).slice(0, limit);
          break;
        case 'best-sellers':
          filteredProducts = [...mockProducts]
            .sort((a, b) => b.reviewCount - a.reviewCount)
            .slice(0, limit);
          break;
        case 'trending':
          filteredProducts = [...mockProducts]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
          break;
        default:
          filteredProducts = mockProducts.slice(0, limit);
      }
      
      setProducts(filteredProducts);
      setIsLoading(false);
    }, 500);
  }, [type, limit]);
  
  return { products, isLoading };
};
