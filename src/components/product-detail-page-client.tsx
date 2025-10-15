'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button, Chip, Divider, Accordion, AccordionItem, Badge } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/product';
import { formatPrice, getStockStatus } from '../utils/productUtils';
import RelatedProducts from './related-products';

interface ProductDetailPageClientProps {
  product: Product;
  relatedProducts: Product[];
  allBrands: string[];
}

const ProductDetailPageClient: React.FC<ProductDetailPageClientProps> = ({ product, relatedProducts, allBrands }) => {
  const { t } = useTranslation(['products', 'navigation']);
  const { cartItems, addToCart, updateCartItemQuantity, removeFromCart } = useCart();
  const cartItem = product ? cartItems.find(item => item.product.id === product.id) : undefined;
  
  const [selectedImage, setSelectedImage] = React.useState(0);

  React.useEffect(() => {
    if (product) {
      setSelectedImage(0);
    }
  }, [product]);

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleBuyNow = () => {
    const message = `Hola, ¡buen día! Quiero comprar este producto:\n\n• ${product.name} x1 - ${formatPrice(product.discountPrice || product.price)}\n\n¡Muchas gracias!`;
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const stockStatus = getStockStatus(product);
  const isInStock = product.stock > 0;

  const sortedFragranceNotes = product.fragranceNotes?.sort((a, b) => b.percentage - a.percentage);

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
        <div className="md:sticky md:top-24 self-start px-4 md:px-0">
          <div className="relative rounded-lg overflow-hidden shadow-lg mb-4 bg-default-100">
            <Image 
              src={product.imageUrls?.[selectedImage] || '/placeholder-product.svg'} 
              alt={product.name || 'Product image'}
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
                  className={`rounded-md overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                >
                  <Image 
                    src={image} 
                    alt={`${product.name || 'Product'} view ${index + 1}`}
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
            {cartItem ? (
              <div className="flex items-center gap-2">
                <Button 
                  isIconOnly 
                  variant="flat" 
                  onPress={() => cartItem.quantity > 1 ? updateCartItemQuantity(cartItem.id, cartItem.quantity - 1) : removeFromCart(cartItem.id)}
                >
                  <Icon icon={cartItem.quantity > 1 ? 'lucide:minus' : 'lucide:trash'} />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{cartItem.quantity}</span>
                <Button 
                  isIconOnly 
                  variant="flat" 
                  onPress={() => updateCartItemQuantity(cartItem.id, cartItem.quantity + 1)} 
                  isDisabled={!isInStock || cartItem.quantity >= product.stock}
                >
                  <Icon icon="lucide:plus" />
                </Button>
              </div>
            ) : (
              <>
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
                <Button
                  color="secondary"
                  size="lg"
                  onPress={handleBuyNow}
                  startContent={<Icon icon="lucide:send" />}
                  isDisabled={!isInStock}
                  className="w-full sm:w-auto flex-grow"
                >
                  {t('products:actions.buyNow')}
                </Button>
              </>
            )}
          </div>
          
          <Divider className="my-6" />

          {/* Accordion for details */}
          <Accordion selectionMode="multiple" defaultExpandedKeys={["description", "notes"]}>
            <AccordionItem key="description" title={t('products:details.description')}>
              <div className="prose prose-sm text-default-600 py-2" dangerouslySetInnerHTML={{ __html: product.description }} />
            </AccordionItem>

            {sortedFragranceNotes && sortedFragranceNotes.length > 0 && (
              <AccordionItem key="notes" title={t('products:details.fragranceNotes')}>
                <div className="py-2 space-y-3">
                  {sortedFragranceNotes.map(({ fragranceNote, percentage }) => (
                    <div key={fragranceNote.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-default-700">{fragranceNote.name}</span>
                        <span className="text-sm text-default-500">{percentage}%</span>
                      </div>
                      <div className="w-full bg-default-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ width: `${percentage}%`, backgroundColor: fragranceNote.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
                    <span className="text-default-800">{product.sex.map(s => t(`sex.${s.toLowerCase()}`)).join(', ')}</span>
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
      
      <RelatedProducts products={relatedProducts} />

      <div className="mt-16 md:mt-24">
        <h3 className="text-lg font-bold mb-4 text-center">{t('titles.browseByBrand')}</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {allBrands.map(brand => (
            <Link key={brand} href={`/products?brands=${encodeURIComponent(brand)}`}>
              <Chip variant="flat">{brand}</Chip>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPageClient;
