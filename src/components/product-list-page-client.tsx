'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/queries/useProducts';
import ProductGrid from './product-grid';
import ProductFilters from './product-filters';
import ProductGridSkeleton from '@/components/skeletons/ProductGridSkeleton';
import { useFavorites } from '@/hooks/useFavorites';
import { useProductBrands } from '@/hooks/queries/useProductBrands';
import { useUI } from '@/context/UIContext';
import Filters from './filters';
import { Button } from '@heroui/react';

const ProductListPageClient = () => {
  const searchParams = useSearchParams();
  const { favoriteIds } = useFavorites();
  const { state: { isFiltersOpen }, openFilters, closeFilters } = useUI();

  const filters = {
    brands: searchParams.get('brands')?.split(',') || [],
    sex: searchParams.get('sex')?.split(',') || [],
    bottleSize: searchParams.get('bottleSize')?.split(',').map(Number) || [],
  };
  const showFavorites = searchParams.get('favorites') === 'true';

  const { data, isLoading, error } = useProducts(filters);
  const { data: availableBrands, isLoading: isLoadingBrands } = useProductBrands(filters);

  const filteredProducts = React.useMemo(() => {
    if (!data?.products) return [];
    if (showFavorites) {
      return data.products.filter(p => favoriteIds.includes(p.id));
    }
    return data.products;
  }, [data, showFavorites, favoriteIds]);

  if (error) {
    return <div>Error loading products.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <aside className="hidden md:block lg:col-span-1">
          <ProductFilters availableBrands={availableBrands || []} />
        </aside>

        <main className="md:col-span-2 lg:col-span-3">
          <div className="md:hidden mb-4">
            <Button onPress={openFilters}>Filters</Button>
          </div>
          {isLoading ? (
            <ProductGridSkeleton />
          ) : (
            <ProductGrid products={filteredProducts || []} />
          )}
        </main>
      </div>
      {isFiltersOpen && (
        <Filters availableBrands={availableBrands || []} onClose={closeFilters} />
      )}
    </div>
  );
};

export default ProductListPageClient;
