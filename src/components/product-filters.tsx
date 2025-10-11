'use client';

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
import { useTranslation } from 'react-i18next';

interface FilterState {
  sex: string[];
  bottleSize: string[];
  brands: string[];
  price: { min: number; max: number };
  ratings: number[];
}

interface ProductFiltersProps {
  onFilterChange: (filters: Partial<FilterState>) => void;
  filters: FilterState;
  onClearFilters: () => void;
  isMobile?: boolean;
  availableBrands: string[];
  availableBottleSizes: string[];
  priceRange: { min: number; max: number };
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  filters,
  onClearFilters,
  isMobile = false,
  availableBrands,
  availableBottleSizes,
  priceRange,
}) => {
  const { t } = useTranslation('products');

  const handleBrandChange = (selectedBrands: string[]) => {
    onFilterChange({ brands: selectedBrands });
  };

  const handleSexChange = (selectedSexes: string[]) => {
    onFilterChange({ sex: selectedSexes });
  };

  const handleBottleSizeChange = (selectedSizes: string[]) => {
    onFilterChange({ bottleSize: selectedSizes });
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
        <h3 className="text-lg font-semibold">{t('filters.filters')}</h3>
        <Button
          size="sm"
          variant="light"
          onPress={onClearFilters}
          className="text-default-500 text-sm"
        >
          {t('filters.clearAll')}
        </Button>
      </div>

      <Divider className="mb-4" />

      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={["sex", "brands", "price"]}
      >
        <AccordionItem key="sex" title={t('filters.sex')}>
          <CheckboxGroup
            value={filters.sex}
            onValueChange={handleSexChange}
            className="gap-2"
          >
            {["WOMAN", "MAN", "UNISEX"].map((s) => (
              <Checkbox key={s} value={s}>
                {t(`sex.${s.toLowerCase()}`)}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>

        {availableBrands.length > 0 && (
          <AccordionItem key="brands" title={t('filters.brands')}>
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
        )}

        {availableBottleSizes.length > 0 && (
          <AccordionItem key="bottleSize" title={t('filters.bottleSize')}>
            <CheckboxGroup
              value={filters.bottleSize}
              onValueChange={handleBottleSizeChange}
              className="gap-2"
            >
              {availableBottleSizes.map((size) => (
                <Checkbox key={size} value={size}>
                  {`${size} ml`}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </AccordionItem>
        )}

        <AccordionItem key="price" title={t('filters.priceRange')}>
          <Slider
            label={t('filters.priceRange')}
            step={10}
            minValue={priceRange.min}
            maxValue={priceRange.max}
            defaultValue={[filters.price.min, filters.price.max]}
            formatOptions={{ style: "currency", currency: "USD" }}
            className="max-w-md"
            onChange={handlePriceChange}
          />
        </AccordionItem>

        <AccordionItem key="rating" title={t('filters.rating')}>
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
