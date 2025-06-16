// Create the missing use-product hook
import React from 'react';
import { Product } from '../types/product';
import { MOCK_PRODUCTS, getMockProductById } from '../data/mockProducts';

export const useProduct = (productId: string | undefined) => {
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);
  
  React.useEffect(() => {
    // If no productId, set loading to false immediately
    if (!productId) {
      setIsLoading(false);
      setProduct(null);
      setRelatedProducts([]);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    const timeoutId = setTimeout(() => {
      const foundProduct = getMockProductById(productId);
      setProduct(foundProduct);
      
      // Get related products (same category)
      if (foundProduct) {
        const related = MOCK_PRODUCTS
          .filter(p => 
            p.categories.some(cat => foundProduct.categories.includes(cat)) && 
            p.id !== foundProduct.id
          )
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        setRelatedProducts([]);
      }
      
      setIsLoading(false);
    }, 500);
    
    // Cleanup function to cancel timeout if productId changes
    return () => clearTimeout(timeoutId);
  }, [productId]);
  
  return { product, isLoading, relatedProducts };
};
