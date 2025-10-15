'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Accordion, AccordionItem, Checkbox, CheckboxGroup, Button, Divider } from '@heroui/react';
import { useTranslation } from 'react-i18next';

// As per the new data model
const ALL_SEXES = ['MAN', 'WOMAN', 'UNISEX'];
const ALL_BOTTLE_SIZES = ['50', '100', '200'];

const sexStyles = {
  MAN: 'border-blue-500',
  WOMAN: 'border-pink-400',
  UNISEX: 'border-amber-300',
};

interface ProductFiltersProps {
  availableBrands: string[];
  onClose: () => void;
}

const Filters: React.FC<ProductFiltersProps> = ({ availableBrands, onClose }) => {
  const { t } = useTranslation('products');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    }
    return newSearchParams.toString();
  };

  const handleFilterChange = (key: string, values: string[] | null) => {
    const queryString = createQueryString({ [key]: values && values.length > 0 ? values.join(',') : null });
    router.push(`${pathname}?${queryString}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const selectedBrands = searchParams.get('brands')?.split(',') || [];
  const selectedSexes = searchParams.get('sex')?.split(',') || [];
  const selectedBottleSizes = searchParams.get('bottleSize')?.split(',') || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end pt-14" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 w-full max-w-sm h-full overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t('filters.filters')}</h3>
          <Button size="sm" variant="light" onPress={onClose} className="text-default-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <Divider className="mb-4" />

        <Checkbox
          isSelected={searchParams.get('favorites') === 'true'}
          onValueChange={(isSelected) => handleFilterChange('favorites', isSelected ? ['true'] : null)}
          className="mb-4"
        >
          {t('filters.showFavorites')}
        </Checkbox>

        <Accordion selectionMode="multiple" defaultExpandedKeys={['sex', 'brands', 'bottleSize']}>
          <AccordionItem key="sex" title={t('filters.sex')}>
            <CheckboxGroup
              value={selectedSexes}
              onValueChange={(values) => handleFilterChange('sex', values)}
              className="gap-2"
            >
              {ALL_SEXES.map((s) => (
                <Checkbox key={s} value={s} className={`border-2 ${sexStyles[s as keyof typeof sexStyles]}`}>
                  {t(`sex.${s.toLowerCase()}`)}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </AccordionItem>

          {availableBrands.length > 0 && (
            <AccordionItem key="brands" title={t('filters.brands')}>
              <CheckboxGroup
                value={selectedBrands}
                onValueChange={(values) => handleFilterChange('brands', values)}
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

          <AccordionItem key="bottleSize" title={t('filters.bottleSize')}>
            <CheckboxGroup
              value={selectedBottleSizes}
              onValueChange={(values) => handleFilterChange('bottleSize', values)}
              className="gap-2"
            >
              {ALL_BOTTLE_SIZES.map((size) => (
                <Checkbox key={size} value={size}>
                  {`${size} ml`}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Filters;
