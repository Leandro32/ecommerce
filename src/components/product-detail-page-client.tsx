'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button, Chip, Divider, Accordion, AccordionItem, Badge, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import ProductGrid from './product-grid';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/product';
import { formatPrice, getStockStatus } from '../utils/productUtils';
import { useProduct } from '../hooks/useProduct';

interface ProductDetailPageClientProps {
  slug: string;
  relatedProducts: Product[];
}

const ProductDetailPageClient: React.FC<ProductDetailPageClientProps> = ({ slug, relatedProducts }) => {
  const { t } = useTranslation(['products', 'navigation']);
  const { addToCart } = useCart();
  const { product, loading, error } = useProduct(slug);
  
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [product]);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-center py-10">Error loading product.</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product.stock));
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  
  const stockStatus = getStockStatus(product);
  const isInStock = product.stock > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6 md:py-10"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-default-500 mb-6 px-4 md:px-0">
        <Link href="/" className="hover:text-primary">{t('navigation:main.home')}</Link>
        <Icon icon="lucide:chevron-right" className="mx-2 text-xs" />
        <Link href="/products" className="hover:text-primary">{t('navigation:main.products')}</Link>
        <Icon icon="lucide:chevron-right" className="mx-2 text-xs" />
        <span className="text-default-800 truncate">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="px-4 md:px-0">
          <div className="relative rounded-lg overflow-hidden shadow-lg mb-4 bg-default-100">
            <Image 
              src={product.imageUrls?.[selectedImage] || '/placeholder-product.svg'} 
              alt={product.name}
              width={600}
              height={600}
              className="w-full aspect-square object-cover transition-opacity duration-300"
            />
            {product.isDiscounted && (
              <Badge color="danger" className="absolute top-3 right-3">SALE</Badge>
            )}
          </div>
          
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.imageUrls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="px-4 md:px-0">
          <p className="text-sm font-bold uppercase text-primary-500 mb-1">{product.brand}</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg text-default-500 mb-4">{product.bottleSize}ml</p>
          
          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            {product.isDiscounted && product.discountPrice ? (
              <>
                <span className="text-3xl font-bold text-danger-500">{formatPrice(product.discountPrice)}</span>
                <span className="text-xl text-default-400 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>

          <Chip color={stockStatus.color} variant="flat" className="mb-6">{stockStatus.text}</Chip>
          
          <Divider className="my-6" />
          
          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button isIconOnly variant="flat" onPress={decrementQuantity} isDisabled={quantity <= 1}>
                <Icon icon="lucide:minus" />
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button isIconOnly variant="flat" onPress={incrementQuantity} isDisabled={!isInStock || quantity >= product.stock}>
                <Icon icon="lucide:plus" />
              </Button>
            </div>
            <Button
              color="primary"
              size="lg"
              onPress={handleAddToCart}
              startContent={<Icon icon="lucide:shopping-cart" />}
              isDisabled={!isInStock}
              className="w-full sm:w-auto flex-grow"
            >
              {t('products:actions.addToCart')}
            </Button>
          </div>
          
          <Divider className="my-6" />

          {/* Accordion for details */}
          <Accordion selectionMode="multiple" defaultExpandedKeys={["description", "notes"]}>
            <AccordionItem key="description" title={t('products:details.description')}>
              <div className="prose prose-sm text-default-600 py-2" dangerouslySetInnerHTML={{ __html: product.description }} />
            </AccordionItem>

            {product.fragranceNotes && (
              <AccordionItem key="notes" title={t('products:details.fragranceNotes')}>
                <div className="py-2 space-y-4">
                  <div className="flex items-start">
                    <Icon icon="fluent-emoji-high-contrast:leaf-fluttering-in-wind" className="text-success-500 text-xl mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold">{t('products:details.topNotes')}</h4>
                      <p className="text-sm text-default-600">{product.fragranceNotes.topNotes}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Icon icon="fluent-emoji-high-contrast:hibiscus" className="text-primary-500 text-xl mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold">{t('products:details.middleNotes')}</h4>
                      <p className="text-sm text-default-600">{product.fragranceNotes.middleNotes}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Icon icon="fluent-emoji-high-contrast:wood" className="text-yellow-700 text-xl mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold">{t('products:details.baseNotes')}</h4>
                      <p className="text-sm text-default-600">{product.fragranceNotes.baseNotes}</p>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            )}

            <AccordionItem key="reviews" title={`${t('products:details.reviews')} (${product.reviews?.length || 0})`}>
              <div className="py-2 space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map(review => (
                    <div key={review.id}>
                      <div className="flex items-center mb-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Icon key={i} icon="lucide:star" className={i < review.rating ? 'text-warning-500' : 'text-default-300'} />
                          ))}
                        </div>
                        <p className="ml-2 font-semibold">{review.customerName}</p>
                      </div>
                      <p className="text-sm text-default-600">{review.reviewText}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-default-500 text-center py-4">{t('products:messages.noReviews')}</p>
                )}
              </div>
            </AccordionItem>

            <AccordionItem key="specs" title={t('products:details.specifications')}>
                <div className="py-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-default-100">
                    <span className="font-medium text-default-600">{t('products:details.brand')}</span>
                    <span className="text-default-800">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-default-100">
                    <span className="font-medium text-default-600">{t('products:details.sex')}</span>
                    <span className="text-default-800">{t(`sex.${product.sex.toLowerCase()}`)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-default-100">
                    <span className="font-medium text-default-600">{t('products:details.packaging')}</span>
                    <span className="text-default-800">{product.packaging}</span>
                  </div>
                </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16 md:mt-24">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('products:titles.youMayLike')}</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetailPageClient;
