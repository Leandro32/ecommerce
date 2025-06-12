// Create the missing ProductListPage component
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Drawer, Pagination } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/product-grid';
import ProductFilters from '../components/product-filters';
import { useProducts } from '../hooks/use-products';

interface ProductListParams {
  category?: string;
}

const ProductListPage: React.FC = () => {
  const { category } = useParams<ProductListParams>();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    categories: category ? [category] : [],
    brands: [],
    price: { min: 0, max: 1000 },
    ratings: [],
    sort: 'newest'
  });
  
  const { products, isLoading, totalPages } = useProducts(filters, currentPage);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };
  
  const handleClearFilters = () => {
    setFilters({
      categories: category ? [category] : [],
      brands: [],
      price: { min: 0, max: 1000 },
      ratings: [],
      sort: 'newest'
    });
    setCurrentPage(1);
  };
  
  const handleSortChange = (key: string) => {
    setFilters({ ...filters, sort: key });
    setCurrentPage(1);
  };
  
  const sortOptions = [
    { key: 'newest', label: 'Newest' },
    { key: 'price-asc', label: 'Price: Low to High' },
    { key: 'price-desc', label: 'Price: High to Low' },
    { key: 'rating', label: 'Top Rated' }
  ];
  
  const pageTitle = category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
    : 'All Products';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{pageTitle}</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant="flat"
            size="sm"
            onPress={() => setIsFilterDrawerOpen(true)}
            startContent={<Icon icon="lucide:filter" className="text-sm" />}
            className="md:hidden"
          >
            Filters
          </Button>
          
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-default-500">Sort by:</span>
            {sortOptions.map((option) => (
              <Button
                key={option.key}
                size="sm"
                variant={filters.sort === option.key ? "solid" : "flat"}
                color={filters.sort === option.key ? "primary" : "default"}
                onPress={() => handleSortChange(option.key)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="hidden md:block">
          <ProductFilters 
            onFilterChange={handleFilterChange}
            filters={filters}
            onClearFilters={handleClearFilters}
          />
        </div>
        
        <div className="md:col-span-3">
          <ProductGrid products={products} isLoading={isLoading} />
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                total={totalPages}
                initialPage={currentPage}
                onChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
      
      <Drawer 
        isOpen={isFilterDrawerOpen} 
        onClose={() => setIsFilterDrawerOpen(false)}
        placement="bottom"
        size="lg"
      >
        <ProductFilters 
          onFilterChange={handleFilterChange}
          filters={filters}
          onClearFilters={handleClearFilters}
          isMobile
        />
        
        <div className="flex justify-end p-4 mt-4 border-t border-divider">
          <Button 
            color="primary"
            onPress={() => setIsFilterDrawerOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </Drawer>
    </motion.div>
  );
};

export default ProductListPage;