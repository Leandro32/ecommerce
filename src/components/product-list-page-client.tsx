'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Drawer, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import ProductGrid from "./product-grid";
import ProductFilters from "./product-filters";
import type { Product } from '../types/product';

interface ProductListPageClientProps {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  productsPerPage: number;
  availableBrands: string[];
  availableBottleSizes: string[];
  priceRange: { min: number; max: number };
}

const ProductListPageClient: React.FC<ProductListPageClientProps> = ({
  products,
  totalProducts,
  totalPages,
  productsPerPage,
  availableBrands,
  availableBottleSizes,
  priceRange,
}) => {
  const { t } = useTranslation(['products', 'common']);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);

  const currentPage = Number(searchParams.get('page') || '1');

  const start = totalProducts > 0 ? (currentPage - 1) * productsPerPage + 1 : 0;
  const end = (currentPage - 1) * productsPerPage + products.length;

  const filters = {
    sex: searchParams.getAll('sex'),
    brands: searchParams.getAll('brand'),
    bottleSize: searchParams.getAll('bottleSize'),
    price: {
      min: Number(searchParams.get('price_min') || priceRange.min),
      max: Number(searchParams.get('price_max') || priceRange.max),
    },
    ratings: searchParams.getAll('rating').map(Number),
    sort: searchParams.get('sort') || 'newest',
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    Object.entries(newFilters).forEach(([key, value]) => {
      params.delete(key);
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)));
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          params.set(`${key}_${subKey}`, String(subValue));
        });
      } else if (value) {
        params.set(key, String(value));
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push('/products');
  };

  const handleSortChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', key);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`);
  };

  const sortOptions = [
    { key: "newest", label: t('sorting.newest') },
    { key: "price-asc", label: t('sorting.priceAsc') },
    { key: "price-desc", label: t('sorting.priceDesc') },
    { key: "rating", label: t('sorting.rating') },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{t('titles.allProducts')}</h1>
          <p className="text-sm text-default-500 mt-1">
            {t('info.showingResults', { start, end, total: totalProducts })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="flat" size="sm" onPress={() => setIsFilterDrawerOpen(true)} startContent={<Icon icon="lucide:filter" className="text-sm" />} className="md:hidden">
            {t('filters.filters')}
          </Button>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-default-500">{t('sorting.sortBy')}:</span>
            {sortOptions.map((option) => (
              <Button key={option.key} size="sm" variant={filters.sort === option.key ? "solid" : "flat"} color={filters.sort === option.key ? "primary" : "default"} onPress={() => handleSortChange(option.key)}>
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="hidden md:block">
          <ProductFilters onFilterChange={handleFilterChange} filters={filters} onClearFilters={handleClearFilters} availableBrands={availableBrands} availableBottleSizes={availableBottleSizes} priceRange={priceRange} />
        </div>
        <div className="md:col-span-3">
          <ProductGrid products={products} emptyMessage={t('messages.filterNoResults')} />
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination total={totalPages} page={currentPage} onChange={handlePageChange} showControls color="primary" />
            </div>
          )}
        </div>
      </div>
      <Drawer isOpen={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen} placement="left" size="md">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t('filters.filters')}</h2>
            <Button isIconOnly variant="light" onPress={() => setIsFilterDrawerOpen(false)}>
              <Icon icon="lucide:x" />
            </Button>
          </div>
          <ProductFilters onFilterChange={handleFilterChange} filters={filters} onClearFilters={handleClearFilters} isMobile availableBrands={availableBrands} availableBottleSizes={availableBottleSizes} priceRange={priceRange} />
        </div>
      </Drawer>
    </motion.div>
  );
};

export default ProductListPageClient;
