import React from 'react';
import { Product } from '@/types/product';
import ProductGrid from './product-grid';
import { useTranslation } from 'react-i18next';

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const { t } = useTranslation('products');

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 md:mt-24">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('titles.youMayLike')}</h2>
      <ProductGrid products={products} />
    </div>
  );
};

export default RelatedProducts;
