import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import ProductGrid from './product-grid';
import { useFeaturedProducts } from '../hooks/use-featured-products';

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  type: 'new-arrivals' | 'best-sellers' | 'trending';
  limit?: number;
  showViewAll?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  title, 
  subtitle,
  type,
  limit = 8,
  showViewAll = true
}) => {
  const { products, isLoading } = useFeaturedProducts(type, limit);
  
  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-default-500 text-sm">{subtitle}</p>}
        </div>
        
        {showViewAll && (
          <Button
            as={Link}
            to={`/products/${type}`}
            variant="light"
            color="primary"
            size="sm"
            endContent={<Icon icon="lucide:arrow-right" className="text-sm" />}
            className="mt-2 sm:mt-0"
          >
            View All
          </Button>
        )}
      </div>
      
      <ProductGrid products={products} isLoading={isLoading} />
    </section>
  );
};

export default FeaturedProducts;