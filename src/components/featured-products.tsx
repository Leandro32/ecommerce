import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import ProductGrid from "./product-grid";
import { useFeaturedProducts, useProducts } from "../hooks/useProducts";
import { transformGoogleSheetsProducts } from "../utils/productUtils";
import type { Product } from "../types/product";
import {
  MOCK_PRODUCTS,
  getMockFeaturedProducts,
  getMockNewArrivals,
  getMockBestSellers,
} from "../data/mockProducts";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  type: "new-arrivals" | "best-sellers" | "trending" | "featured";
  limit?: number;
  showViewAll?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  subtitle,
  type,
  limit = 8,
  showViewAll = true,
}) => {
  // Try to get products from Google Sheets
  const {
    products: allProducts,
    loading: allLoading,
    error: allError,
  } = useProducts();
  const {
    products: featuredProducts,
    loading: featuredLoading,
    error: featuredError,
  } = useFeaturedProducts();

  // Determine which products to use based on type
  const getProductsByType = React.useMemo(() => {
    let sourceProducts: Product[] = [];
    let isLoading = false;
    let hasError = false;

    // If Google Sheets is available, use it
    if (allProducts && allProducts.length > 0) {
      const transformedProducts = transformGoogleSheetsProducts(allProducts);

      switch (type) {
        case "featured":
          sourceProducts = transformedProducts.filter((p) => p.featured);
          break;
        case "new-arrivals":
          sourceProducts = transformedProducts.filter(
            (p) => p.isNew || p.featured,
          );
          break;
        case "best-sellers":
          sourceProducts = transformedProducts.sort(
            (a, b) => (b.rating || 0) - (a.rating || 0),
          );
          break;
        case "trending":
          sourceProducts = transformedProducts.filter(
            (p) => p.featured || p.isNew,
          );
          break;
        default:
          sourceProducts = transformedProducts;
      }

      isLoading = allLoading || featuredLoading;
      hasError = !!allError || !!featuredError;
    } else if (allLoading || featuredLoading) {
      // Still loading Google Sheets
      isLoading = true;
    } else {
      // Fallback to mock products
      console.log("Using mock products for", type);

      switch (type) {
        case "featured":
          sourceProducts = getMockFeaturedProducts();
          break;
        case "new-arrivals":
          sourceProducts = getMockNewArrivals();
          break;
        case "best-sellers":
          sourceProducts = getMockBestSellers();
          break;
        case "trending":
          sourceProducts = MOCK_PRODUCTS.filter((p) => p.featured || p.isNew);
          break;
        default:
          sourceProducts = MOCK_PRODUCTS;
      }
    }

    return {
      products: sourceProducts.slice(0, limit),
      isLoading,
      hasError,
    };
  }, [
    allProducts,
    featuredProducts,
    allLoading,
    featuredLoading,
    allError,
    featuredError,
    type,
    limit,
  ]);

  const { products, isLoading, hasError } = getProductsByType;

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
