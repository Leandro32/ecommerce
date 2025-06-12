import React from 'react';
import { Spinner } from '@heroui/react';
import ProductCard from './product-card';
import { Product } from '../types/product';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  isLoading = false,
  emptyMessage = "No products found"
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-default-500 text-center">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;