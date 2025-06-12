// Create the missing use-products hook
import React from 'react';
import { Product } from '../types/product';

// Mock product data
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

export const useProducts = (filters: any, page = 1, pageSize = 12) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [totalPages, setTotalPages] = React.useState(1);
  
  React.useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call with filtering
    setTimeout(() => {
      let filteredProducts = [...mockProducts];
      
      // Apply category filter
      if (filters.categories && filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.categories.includes(product.category)
        );
      }
      
      // Apply brand filter
      if (filters.brands && filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.brands.includes(product.brand)
        );
      }
      
      // Apply price filter
      filteredProducts = filteredProducts.filter(product => 
        product.price >= filters.price.min && product.price <= filters.price.max
      );
      
      // Apply rating filter
      if (filters.ratings && filters.ratings.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.ratings.some((rating: number) => product.rating >= rating)
        );
      }
      
      // Apply sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
          default:
            // Already sorted by newest
            break;
        }
      }
      
      // Calculate pagination
      const total = Math.ceil(filteredProducts.length / pageSize);
      setTotalPages(total);
      
      // Apply pagination
      const start = (page - 1) * pageSize;
      const paginatedProducts = filteredProducts.slice(start, start + pageSize);
      
      setProducts(paginatedProducts);
      setIsLoading(false);
    }, 500);
  }, [filters, page, pageSize]);
  
  return { products, isLoading, totalPages };
};
