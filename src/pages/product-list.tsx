// Create the missing ProductListPage component
import React from "react";
import { useParams } from "react-router-dom";
import { Button, Drawer, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import ProductGrid from "../components/product-grid";
import ProductFilters from "../components/product-filters";
import { useProducts, useProductsByCategory } from "../hooks/useProducts";
import type { Product as GoogleSheetsProduct } from "../services/googleSheetsService";
import type { Product } from "../types/product";
import {
  transformGoogleSheetsProducts,
  sortProducts,
  getDisplayPrice,
} from "../utils/productUtils";

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
    sort: "newest",
  });

  // Use Google Sheets hooks
  const {
    products: allProducts,
    loading: allProductsLoading,
    error: allProductsError,
  } = useProducts();
  const {
    products: categoryProducts,
    loading: categoryLoading,
    error: categoryError,
  } = useProductsByCategory(category || "");

  // Determine which products to use based on category and transform them
  const sourceGoogleSheetsProducts = category ? categoryProducts : allProducts;
  const isLoading = category ? categoryLoading : allProductsLoading;
  const error = category ? categoryError : allProductsError;

  // Transform Google Sheets products to be compatible with existing components
  const sourceProducts = React.useMemo(() => {
    return sourceGoogleSheetsProducts
      ? transformGoogleSheetsProducts(sourceGoogleSheetsProducts)
      : [];
  }, [sourceGoogleSheetsProducts]);

  // Filter and sort products based on current filters
  const filteredProducts = React.useMemo(() => {
    if (!sourceProducts || sourceProducts.length === 0) return [];

    let filtered = [...sourceProducts];

    // Filter by price range
    filtered = filtered.filter((product) => {
      const price = getDisplayPrice(product);
      return price >= filters.price.min && price <= filters.price.max;
    });

    // Filter by categories (if not already filtered by route)
    if (!category && filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((cat) =>
          filters.categories.some((filterCat) =>
            cat.toLowerCase().includes(filterCat.toLowerCase()),
          ),
        ),
      );
    }

    // Filter by brands
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.some(
          (brand) =>
            product.brand?.toLowerCase().includes(brand.toLowerCase()) ||
            product.tags.some((tag) =>
              tag.toLowerCase().includes(brand.toLowerCase()),
            ),
        ),
      );
    }

    // Sort products using utility function
    filtered = sortProducts(filtered, filters.sort);

    return filtered;
  }, [sourceProducts, filters, category]);

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
    { key: "newest", label: "Newest" },
    { key: "price-asc", label: "Price: Low to High" },
    { key: "price-desc", label: "Price: High to Low" },
    { key: "rating", label: "Top Rated" },
  ];

  const pageTitle = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
    : "All Products";

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
          {error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Error Loading Products
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ProductGrid products={paginatedProducts} isLoading={isLoading} />

              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                    <Icon
                      icon="lucide:search-x"
                      className="text-4xl text-gray-400 mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No products match your current filters.
                    </p>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={handleClearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}

              {!isLoading && filteredProducts.length > 0 && (
                <div className="flex justify-between items-center mt-8">
                  <p className="text-sm text-default-500">
                    Showing {startIndex + 1}-
                    {Math.min(
                      startIndex + productsPerPage,
                      filteredProducts.length,
                    )}{" "}
                    of {filteredProducts.length} products
                  </p>

                  {totalPages > 1 && (
                    <Pagination
                      total={totalPages}
                      page={currentPage}
                      onChange={setCurrentPage}
                      showControls
                      showShadow
                      color="primary"
                    />
                  )}
                </div>
              )}
            </>
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
          <Button color="primary" onPress={() => setIsFilterDrawerOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </Drawer>
    </motion.div>
  );
};

export default ProductListPage;
