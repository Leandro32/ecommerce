import React from "react";
import Link from "next/link";
import { Card, CardBody, Button, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Product } from "../types/product";
import ProductImage from "./ProductImage";
import {
  formatPrice,
  getStockStatus,
} from "../utils/productUtils";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cartItems, addToCart, updateCartItemQuantity, removeFromCart } = useCart();
  const cartItem = cartItems.find(item => item.product.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const displayImage = product.imageUrls[0];
  const displayPrice = product.price;
  const stockStatus = getStockStatus(product);
  const isInStock = product.stock > 0;

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-visible h-full w-full" disableRipple>
        <CardBody className="p-0 overflow-visible">
          <Link href={`/product/${product.slug}`} className="block">
            <div className="relative w-full aspect-[3/4] bg-default-100 rounded-t-lg overflow-hidden">
              <ProductImage
                src={displayImage}
                alt={product.name}
                className="w-full h-full"
                fallbackSrc="/placeholder-product.jpg"
                onError={() => {
                  console.warn(
                    `Failed to load image for product: ${product.name}`,
                  );
                }}
                loading="lazy"
              />
            </div>

            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                <span className="text-xs text-default-500 flex-shrink-0 ml-2">
                  {product.bottleSize}ml
                </span>
              </div>
              <p className="text-xs text-default-600 mb-2 font-semibold">{product.brand}</p>

              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-tiny px-2 py-1 rounded-full ${
                    stockStatus.color === "success"
                      ? "bg-success-100 text-success-700"
                      : stockStatus.color === "warning"
                        ? "bg-warning-100 text-warning-700"
                        : "bg-danger-100 text-danger-700"
                  }`}
                >
                  {stockStatus.text}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {product.isDiscounted && product.discountPrice ? (
                  <>
                    <span className="font-semibold text-primary-500">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-sm text-default-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Add to Cart Button or Quantity Controller */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            {cartItem ? (
              <>
                <Button 
                  isIconOnly 
                  size="sm"
                  variant="flat" 
                  onPress={() => cartItem.quantity > 1 ? updateCartItemQuantity(cartItem.id, cartItem.quantity - 1) : removeFromCart(cartItem.id)}
                >
                  <Icon icon={cartItem.quantity > 1 ? 'lucide:minus' : 'lucide:trash'} className="text-base" />
                </Button>
                <span className="font-semibold text-sm w-4 text-center">{cartItem.quantity}</span>
                <Button 
                  isIconOnly 
                  size="sm"
                  variant="flat" 
                  onPress={() => updateCartItemQuantity(cartItem.id, cartItem.quantity + 1)} 
                  isDisabled={!isInStock || cartItem.quantity >= product.stock}
                >
                  <Icon icon="lucide:plus" className="text-base" />
                </Button>
              </>
            ) : (
              <Button
                isIconOnly
                radius="full"
                variant="flat"
                color={isInStock ? "primary" : "default"}
                size="sm"
                className="shadow-md group transition-all duration-200 hover:scale-110"
                onPress={handleAddToCart}
                aria-label="Add to cart"
                isDisabled={!isInStock}
              >
                <Icon
                  icon="lucide:shopping-cart"
                  className="group-hover:opacity-0 transition-opacity duration-200"
                />
                <Icon
                  icon="lucide:plus"
                  className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default ProductCard;