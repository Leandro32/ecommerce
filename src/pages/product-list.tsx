// Create the missing ProductListPage component
import React from "react";
import { useParams } from "react-router-dom";
import { Button, Drawer, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import ProductGrid from "../components/product-grid";
import ProductFilters from "../components/product-filters";
import { useOptimizedProducts } from "../hooks/useOptimizedProducts";
import { useDebounce } from "../hooks/useDebounce";

interface ProductListParams {
  category?: string;
}

const ProductListPage: React.FC = () => {
  const { category } = useParams<ProductListParams>();
  const { t } = useTranslation(['products', 'common']);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    categories: category ? [category] : [],
    brands: [],
    price: { min: 0, max: 1000 },
    ratings: [],
    sort: "newest",
  });

  // Debounce filter changes to prevent excessive re-renders
  const debouncedFilters = useDebounce(filters, 300);

  // Use optimized hook that separates data fetching from filtering
  const {
    products: filteredProducts,
    loading,
    error,
    totalProducts,
    refetch
  } = useOptimizedProducts(category, debouncedFilters);

  // Pagination
  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

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
      sort: "newest",
    });
    setCurrentPage(1);
  };

  const handleSortChange = (key: string) => {
    setFilters({ ...filters, sort: key });
    setCurrentPage(1);
  };

  const sortOptions = [
    { key: "newest", label: t('sorting.newest') },
    { key: "price-asc", label: t('sorting.priceAsc') },
    { key: "price-desc", label: t('sorting.priceDesc') },
    { key: "rating", label: t('sorting.rating') },
  ];

  const pageTitle = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} ${t('titles.allProducts')}`
    : t('titles.allProducts');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          <p className="text-sm text-default-500 mt-1">
            {loading ? t('messages.loadingProducts') : t('info.showingResults', {
              start: startIndex + 1,
              end: Math.min(startIndex + productsPerPage, filteredProducts.length),
              total: totalProducts
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="flat"
            size="sm"
            onPress={() => setIsFilterDrawerOpen(true)}
            startContent={<Icon icon="lucide:filter" className="text-sm" />}
            className="md:hidden"
          >
            {t('filters.filters')}
          </Button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-default-500">{t('sorting.sortBy')}:</span>
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
          {error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  {t('messages.errorLoadingProducts')}
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => refetch()}
                >
                  {t('messages.tryAgain')}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ProductGrid
                products={paginatedProducts}
                isLoading={loading}
                emptyMessage={
                  filteredProducts.length === 0 && !loading
                    ? t('messages.filterNoResults')
                    : t('messages.noProductsFound')
                }
              />

              {totalPages > 1 && !loading && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                    showControls
                    color="primary"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        isOpen={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
        placement="left"
        size="md"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t('filters.filters')}</h2>
            <Button
              isIconOnly
              variant="light"
              onPress={() => setIsFilterDrawerOpen(false)}
            >
              <Icon icon="lucide:x" />
            </Button>
          </div>
          <ProductFilters
            onFilterChange={handleFilterChange}
            filters={filters}
            onClearFilters={handleClearFilters}
            isMobile
          />
        </div>
      </Drawer>
    </motion.div>
  );
};

export default ProductListPage;
