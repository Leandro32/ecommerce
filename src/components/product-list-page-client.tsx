'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/queries/useProducts'; // Assuming this hook is adapted to take filters
import ProductGrid from './product-grid';
import ProductFilters from './product-filters';
import { ProductGridSkeleton } from './skeletons/product-grid-skeleton';

import { useFavorites } from '@/hooks/useFavorites';

import { useProductBrands } from '@/hooks/queries/useProductBrands';

const ProductListPageClient = () => {
  const searchParams = useSearchParams();
  const { favoriteIds } = useFavorites();

  const filters = {
    brands: searchParams.get('brands')?.split(',') || [],
    sex: searchParams.get('sex')?.split(',') || [],
    bottleSize: searchParams.get('bottleSize')?.split(',').map(Number) || [],
  };
  const showFavorites = searchParams.get('favorites') === 'true';

  const { data: products, isLoading, error } = useProducts(filters);
  const { data: availableBrands, isLoading: isLoadingBrands } = useProductBrands();

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    if (showFavorites) {
      return products.filter(p => favoriteIds.includes(p.id));
    }
    return products;
  }, [products, showFavorites, favoriteIds]);

  if (error) {
    return <div>Error loading products.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block">
          <ProductFilters availableBrands={availableBrands || []} />
        </aside>

        <main className="lg:col-span-3">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : (
            <ProductGrid products={filteredProducts || []} />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListPageClient;
