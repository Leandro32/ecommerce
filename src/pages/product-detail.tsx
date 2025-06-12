// Create the missing ProductDetailPage component
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Tabs, Tab, Divider, Badge } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import FeaturedProducts from '../components/featured-products';
import { useProduct } from '../hooks/use-product';
import { useCart } from '../hooks/use-cart';

interface ProductDetailParams {
  id: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<ProductDetailParams>();
  const { product, isLoading, relatedProducts } = useProduct(id);
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [product]);
  
  if (isLoading || !product) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse space-y-8 w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-default-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-default-200 rounded w-3/4"></div>
              <div className="h-6 bg-default-200 rounded w-1/4"></div>
              <div className="h-4 bg-default-200 rounded w-full"></div>
              <div className="h-4 bg-default-200 rounded w-full"></div>
              <div className="h-4 bg-default-200 rounded w-3/4"></div>
              <div className="h-10 bg-default-200 rounded w-1/3 mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
        <Link to="/" className="hover:text-primary">Home</Link>
        <Icon icon="lucide:chevron-right" className="mx-2 text-xs" />
        <Link to="/products" className="hover:text-primary">Products</Link>
        <Icon icon="lucide:chevron-right" className="mx-2 text-xs" />
        <span className="text-default-800">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="relative rounded-lg overflow-hidden mb-4">
            <img 
              src={product.images?.[selectedImage] || product.image} 
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            {product.isNew && (
              <Badge 
                content="New" 
                color="primary" 
                placement="top-left"
                className="absolute top-2 left-2"
              />
            )}
            {product.discount > 0 && (
              <Badge 
                content={`-${product.discount}%`} 
                color="danger" 
                placement="top-right"
                className="absolute top-2 right-2"
              />
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
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
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
                  icon={i < Math.floor(product.rating) ? "lucide:star" : "lucide:star"}
                  className={i < Math.floor(product.rating) ? "text-warning-500" : "text-default-300"}
                />
              ))}
            </div>
            <span className="text-default-500">({product.reviewCount} reviews)</span>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-default-400 text-lg line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.discount > 0 && (
              <Badge color="danger" content={`${product.discount}% OFF`} />
            )}
          </div>
          
          <p className="text-default-600 mb-6">{product.description}</p>
          
          <Divider className="my-6" />
          
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <Button
                    key={color}
                    size="sm"
                    variant={selectedColor === color ? "solid" : "bordered"}
                    color={selectedColor === color ? "primary" : "default"}
                    onPress={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <Button
                    key={size}
                    size="sm"
                    variant={selectedSize === size ? "solid" : "bordered"}
                    color={selectedSize === size ? "primary" : "default"}
                    onPress={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Quantity</h3>
            <div className="flex items-center">
              <Button
                isIconOnly
                variant="bordered"
                size="sm"
                onPress={decrementQuantity}
                isDisabled={quantity <= 1}
              >
                <Icon icon="lucide:minus" />
              </Button>
              <span className="mx-4 min-w-[2rem] text-center">{quantity}</span>
              <Button
                isIconOnly
                variant="bordered"
                size="sm"
                onPress={incrementQuantity}
                isDisabled={quantity >= product.stock}
              >
                <Icon icon="lucide:plus" />
              </Button>
              <span className="ml-4 text-sm text-default-500">
                {product.stock} available
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              color="primary"
              size="lg"
              fullWidth
              onPress={handleAddToCart}
              startContent={<Icon icon="lucide:shopping-cart" />}
            >
              Add to Cart
            </Button>
            <Button
              variant="flat"
              color="default"
              size="lg"
              fullWidth
              startContent={<Icon icon="lucide:heart" />}
            >
              Add to Wishlist
            </Button>
          </div>
          
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-default-600">
              <Icon icon="lucide:truck" className="text-default-500" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-default-600">
              <Icon icon="lucide:repeat" className="text-default-500" />
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-default-600">
              <Icon icon="lucide:shield" className="text-default-500" />
              <span>2-year warranty</span>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs aria-label="Product information">
        <Tab key="details" title="Details">
          <div className="py-4">
            <p className="mb-4">{product.description}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Brand: {product.brand}</li>
              <li>SKU: {product.sku || 'N/A'}</li>
              <li>Category: {product.category}</li>
              {product.tags && product.tags.length > 0 && (
                <li>Tags: {product.tags.join(', ')}</li>
              )}
            </ul>
          </div>
        </Tab>
        <Tab key="specifications" title="Specifications">
          <div className="py-4">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-divider">
                  <td className="py-2 font-medium">Material</td>
                  <td className="py-2">Premium quality</td>
                </tr>
                <tr className="border-b border-divider">
                  <td className="py-2 font-medium">Dimensions</td>
                  <td className="py-2">Varies by size</td>
                </tr>
                <tr className="border-b border-divider">
                  <td className="py-2 font-medium">Care Instructions</td>
                  <td className="py-2">Machine wash cold, tumble dry low</td>
                </tr>
                <tr className="border-b border-divider">
                  <td className="py-2 font-medium">Country of Origin</td>
                  <td className="py-2">Imported</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Tab>
        <Tab key="reviews" title={`Reviews (${product.reviewCount})`}>
          <div className="py-4">
            <p className="text-default-500">
              Customer reviews will be displayed here.
            </p>
          </div>
        </Tab>
      </Tabs>
      
      <div className="mt-12">
        <FeaturedProducts 
          title="You May Also Like" 
          type="trending"
          limit={4}
          showViewAll={false}
        />
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;