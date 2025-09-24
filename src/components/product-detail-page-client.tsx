'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button, Chip, Divider, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
import FeaturedProducts from './featured-products';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/product';

interface ProductDetailPageClientProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetailPageClient: React.FC<ProductDetailPageClientProps> = ({ product, relatedProducts }) => {
  const { t } = useTranslation(['products', 'navigation']);
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setSelectedColor(null);
    setSelectedSize(null);
  }, [product.id]);

  const handleAddToCart = () => {
    addToCart(
      product, 
      quantity, 
      { 
        color: selectedColor || undefined, 
        size: selectedSize || undefined 
      }
    );
  };
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  
  const colors = ["Black", "White", "Navy", "Gray", "Red"];
  const sizes = ["XS", "S", "M", "L", "XL"];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-6"
    >
      <div className="flex items-center text-sm text-default-500 mb-6">
        <Link href="/" className="hover:text-primary">{t('navigation:main.home')}</Link>
        <Icon icon="lucide:chevron-right" className="mx-2 text-xs" />
        <Link href="/products" className="hover:text-primary">{t('navigation:main.products')}</Link>
        <Icon icon="lucide:chevron-right" className="mx-2 text-xs" />
        <span className="text-default-800">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="relative rounded-lg overflow-hidden mb-4">
            <Image 
              src={product.images?.[selectedImage] || product.image} 
              alt={product.name}
              width={600}
              height={600}
              className="w-full aspect-square object-cover"
            />
            {product.isNew && (
              <Chip 
                color="primary" 
                className="absolute top-2 left-2"
              >
                {t('products:info.new')}
              </Chip>
            )}
            {product.discount && product.discount > 0 && (
              <Chip 
                color="danger" 
                className="absolute top-2 right-2"
              >
                -{product.discount}%
              </Chip>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-md overflow-hidden border-2 ${
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
        
        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icon 
                  key={i}
                  icon={i < Math.floor(product.rating || 0) ? "lucide:star" : "lucide:star"}
                  className={i < Math.floor(product.rating || 0) ? "text-warning-500" : "text-default-300"}
                />
              ))}
            </div>
            <span className="text-default-500">({product.reviewCount || 0} {t('products:reviews.reviews')})</span>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-default-400 text-lg line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.discount && product.discount > 0 && (
              <Chip color="danger">
                {product.discount}% OFF
              </Chip>
            )}
          </div>
          
          <p className="text-default-600 mb-6">{product.description}</p>
          
          <Divider className="my-6" />
          
          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">{t('products:details.color')}</h3>
            <div className="flex gap-2">
              {colors.map(color => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "solid" : "bordered"}
                  color={selectedColor === color ? "primary" : "default"}
                  size="sm"
                  onPress={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">{t('products:details.size')}</h3>
            <div className="flex gap-2">
              {sizes.map(size => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "solid" : "bordered"}
                  color={selectedSize === size ? "primary" : "default"}
                  size="sm"
                  onPress={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">{t('products:details.quantity')}</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={decrementQuantity}
                  isDisabled={quantity <= 1}
                >
                  <Icon icon="lucide:minus" />
                </Button>
                <span className="mx-4 min-w-[2rem] text-center">{quantity}</span>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={incrementQuantity}
                  isDisabled={quantity >= (product.stock || 100)}
                >
                  <Icon icon="lucide:plus" />
                </Button>
                <span className="ml-4 text-sm text-default-500">
                  {product.stock || 0} {t('products:details.available')}
                </span>
              </div>
            </div>
          </div>
          
          {/* Add to Cart Buttons */}
          <div className="space-y-3">
            <Button
              color="primary"
              size="lg"
              fullWidth
              onPress={handleAddToCart}
              startContent={<Icon icon="lucide:shopping-cart" />}
            >
              {t('products:actions.addToCart')}
            </Button>
            
            <Button
              variant="bordered"
              size="lg"
              fullWidth
              startContent={<Icon icon="lucide:heart" />}
            >
              {t('products:actions.addToWishlist')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Information Tabs */}
      <Tabs aria-label="Product information" className="mb-8">
        <Tab key="description" title={t('products:details.description')}>
          <div className="py-4">
            <p className="text-default-600">{product.description}</p>
          </div>
        </Tab>
        
        <Tab key="specifications" title={t('products:details.specifications')}>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{t('products:details.category')}</span>
                  <span className="text-default-600">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">SKU</span>
                  <span className="text-default-600">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t('products:details.rating')}</span>
                  <span className="text-default-600">{product.rating}/5</span>
                </div>
              </div>
            </div>
          </div>
        </Tab>
        
        <Tab key="reviews" title={t('products:details.reviews')}>
          <div className="py-4">
            <p className="text-default-500 text-center py-8">
              {t('products:messages.customerReviewsPlaceholder')}
            </p>
          </div>
        </Tab>
      </Tabs>
      
      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <FeaturedProducts
          title={t('products:titles.youMayLike')}
          products={relatedProducts}
        />
      )}
    </motion.div>
  );
};

export default ProductDetailPageClient;
