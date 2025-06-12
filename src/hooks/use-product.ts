// Create the missing use-product hook
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
  images: Array.from({ length: 4 }, (_, j) => 
    `https://img.heroui.chat/image/${i % 2 === 0 ? 'clothing' : 'fashion'}?w=400&h=600&u=${i + 1}-${j + 1}`
  ),
  brand: `Brand ${Math.floor(i / 3) + 1}`,
  category: `Category ${Math.floor(i / 5) + 1}`,
  rating: 3 + Math.floor(Math.random() * 3),
  reviewCount: 10 + Math.floor(Math.random() * 100),
  isNew: i < 8,
  discount: i % 4 === 0 ? 20 : 0,
  stock: 10 + Math.floor(Math.random() * 90),
  sku: `SKU-${1000 + i}`,
  tags: ['Tag 1', 'Tag 2', 'Tag 3'].slice(0, Math.floor(Math.random() * 3) + 1)
}));

export const useProduct = (productId: string) => {
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);
  
  React.useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundProduct = mockProducts.find(p => p.id === productId) || null;
      setProduct(foundProduct);
      
      // Get related products (same category)
      if (foundProduct) {
        const related = mockProducts
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      
      setIsLoading(false);
    }, 500);
  }, [productId]);
  
  return { product, isLoading, relatedProducts };
};
