import { useState, useEffect, useMemo, useCallback } from 'react';
import { useProducts, useProductsByCategory } from './useProducts';
import { transformGoogleSheetsProducts, sortProducts, getDisplayPrice } from '../utils/productUtils';
import type { Product } from '../types/product';

interface FilterState {
  categories: string[];
  brands: string[];
  price: { min: number; max: number };
  ratings: number[];
  sort: string;
}

interface UseOptimizedProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
  refetch: () => Promise<void>;
}

/**
 * Optimized hook that separates data fetching from filtering logic
 * to prevent infinite re-renders and improve performance
 */
export const useOptimizedProducts = (
  category?: string,
  filters?: FilterState
): UseOptimizedProductsResult => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Use appropriate hook based on category
  const {
    products: sourceProducts,
    loading: dataLoading,
    error,
    refetch
  } = category 
    ? useProductsByCategory(category)
    : useProducts();

  // Transform products only once when source data changes
  const transformedProducts = useMemo(() => {
    if (!sourceProducts?.length) return [];
    return transformGoogleSheetsProducts(sourceProducts);
  }, [sourceProducts]);

  // Debounced filtering function
  const applyFilters = useCallback((products: Product[], filterState?: FilterState): Promise<Product[]> => {
    if (!filterState || !products?.length) {
      return Promise.resolve(products);
    }

    setIsFiltering(true);

    // Use setTimeout to prevent blocking the UI
    return new Promise<Product[]>((resolve) => {
      setTimeout(() => {
        let filtered = [...products];

        // Filter by price range
        if (filterState.price) {
          filtered = filtered.filter((product) => {
            const price = getDisplayPrice(product);
            return price >= filterState.price.min && price <= filterState.price.max;
          });
        }

        // Filter by categories (if not already filtered by route)
        if (!category && filterState.categories?.length > 0) {
          filtered = filtered.filter((product) =>
            product.categories.some((cat) =>
              filterState.categories.some((filterCat) =>
                cat.toLowerCase().includes(filterCat.toLowerCase())
              )
            )
          );
        }

        // Filter by brands
        if (filterState.brands?.length > 0) {
          filtered = filtered.filter((product) =>
            filterState.brands.some(
              (brand) =>
                product.brand?.toLowerCase().includes(brand.toLowerCase()) ||
                product.tags.some((tag) =>
                  tag.toLowerCase().includes(brand.toLowerCase())
                )
            )
          );
        }

        // Filter by ratings
        if (filterState.ratings?.length > 0) {
          filtered = filtered.filter((product) => {
            const rating = Math.floor(product.rating || 0);
            return filterState.ratings.includes(rating);
          });
        }

        // Sort products
        if (filterState.sort) {
          filtered = sortProducts(filtered, filterState.sort);
        }

        setIsFiltering(false);
        resolve(filtered);
      }, 0);
    });
  }, [category]);

  // Apply filters when filters or products change
  useEffect(() => {
    if (!transformedProducts?.length) {
      setFilteredProducts([]);
      return;
    }

    applyFilters(transformedProducts, filters).then((result) => {
      setFilteredProducts(result);
    });
  }, [transformedProducts, filters, applyFilters]);

  return {
    products: filteredProducts,
    loading: dataLoading || isFiltering,
    error,
    totalProducts: transformedProducts?.length || 0,
    refetch
  };
}; 