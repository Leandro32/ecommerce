import React from "react";
import {
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
  Slider,
  Button,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProducts } from "../hooks/useProducts";
import {
  getAvailableCategories,
  getAvailableBrands,
  getPriceRange,
} from "../utils/productUtils";

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
  filters: any;
  onClearFilters: () => void;
  isMobile?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  filters,
  onClearFilters,
  isMobile = false,
}) => {
  const { products } = useProducts();

  // Get available categories and brands from Google Sheets products
  const availableCategories = React.useMemo(() => {
    if (!products) return [];
    return getAvailableCategories(
      products.map((p) => ({
        ...p,
        categories: p.categories || [],
        tags: p.tags || [],
        brand: p.tags?.find((tag) =>
          ["apple", "samsung", "nike", "adidas", "sony", "microsoft"].includes(
            tag.toLowerCase(),
          ),
        ),
      })),
    );
  }, [products]);

  const availableBrands = React.useMemo(() => {
    if (!products) return [];
    return getAvailableBrands(
      products.map((p) => ({
        ...p,
        categories: p.categories || [],
        tags: p.tags || [],
        brand: p.tags?.find((tag) =>
          ["apple", "samsung", "nike", "adidas", "sony", "microsoft"].includes(
            tag.toLowerCase(),
          ),
        ),
      })),
    );
  }, [products]);

  const priceRange = React.useMemo(() => {
    if (!products) return { min: 0, max: 1000 };
    return getPriceRange(
      products.map((p) => ({
        ...p,
        price: p.salePrice || p.price,
      })),
    );
  }, [products]);

  const handleCategoryChange = (selectedCategories: string[]) => {
    onFilterChange({ ...filters, categories: selectedCategories });
  };

  const handleBrandChange = (selectedBrands: string[]) => {
    onFilterChange({ ...filters, brands: selectedBrands });
  };

  const handlePriceChange = (values: number[]) => {
    onFilterChange({ ...filters, price: { min: values[0], max: values[1] } });
  };

  const handleRatingChange = (selectedRatings: string[]) => {
    onFilterChange({ ...filters, ratings: selectedRatings.map(Number) });
  };

  const containerClass = isMobile ? "p-4" : "sticky top-20 w-full max-w-xs";

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          size="sm"
          variant="light"
          onPress={onClearFilters}
          className="text-default-500 text-sm"
        >
          Clear All
        </Button>
      </div>

      <Divider className="mb-4" />

      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={["categories", "price"]}
      >
        <AccordionItem key="categories" title="Categories">
          <CheckboxGroup
            value={filters.categories}
            onValueChange={handleCategoryChange}
            className="gap-2"
          >
            {availableCategories.map((category) => (
              <Checkbox key={category} value={category}>
                {category}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>

        <AccordionItem key="brands" title="Brands">
          <CheckboxGroup
            value={filters.brands}
            onValueChange={handleBrandChange}
            className="gap-2"
          >
            {availableBrands.map((brand) => (
              <Checkbox key={brand} value={brand}>
                {brand}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>

        <AccordionItem key="price" title="Price Range">
          <Slider
            label="Price Range"
            step={10}
            minValue={priceRange.min}
            maxValue={priceRange.max}
            defaultValue={[filters.price.min, filters.price.max]}
            formatOptions={{ style: "currency", currency: "USD" }}
            className="max-w-md"
            onChange={handlePriceChange}
          />
        </AccordionItem>

        <AccordionItem key="rating" title="Rating">
          <CheckboxGroup
            value={filters.ratings.map(String)}
            onValueChange={handleRatingChange}
            className="gap-2"
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <Checkbox key={rating} value={String(rating)}>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon="lucide:star"
                      className={
                        i < rating
                          ? "text-warning-500 text-xs"
                          : "text-default-300 text-xs"
                      }
                    />
                  ))}
                  <span className="text-sm ml-1">
                    {rating === 1 ? "& Up" : ""}
                  </span>
                </div>
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilters;
