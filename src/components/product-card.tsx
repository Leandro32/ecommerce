import React from "react";
import Link from "next/link";
import { Card, CardBody, Button, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Product } from "../types/product";
import ProductImage from "./ProductImage";
import {
  getDisplayPrice,
  hasDiscount,
  getDiscountPercentage,
  formatPrice,
  getStockStatus,
} from "../utils/productUtils";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  // Handle both legacy and new product structures
  const displayImage = product.image || product.images?.[0] || "";
  const displayPrice = getDisplayPrice(product);
  const hasProductDiscount = hasDiscount(product);
  const discountPercentage = getDiscountPercentage(product);
  const stockStatus = getStockStatus(product);
  const isInStock =
    product.inStock ?? (product.stock ? product.stock > 0 : true);
  const displayBrand =
    product.brand || product.tags?.[0] || product.categories?.[0] || "";
  const displayRating = product.rating || (product.featured ? 4.5 : 4.0);
  const displayReviewCount =
    product.reviewCount || Math.floor(Math.random() * 100) + 10;

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-visible h-full w-full" disableRipple>
        <CardBody className="p-0 overflow-visible">
          <Link href={`/product/${product.id}`} className="block">
            <div className="relative w-full aspect-[3/4] bg-default-100 rounded-t-lg overflow-hidden">
              <ProductImage
                src={displayImage || product.images}
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
              {(product.isNew || product.featured) && (
                <Badge
                  content={product.featured ? "Featured" : "New"}
                  color="primary"
                  placement="top-left"
                  className="absolute top-2 left-2"
                />
              )}
              {hasProductDiscount && discountPercentage > 0 && (
                <Badge
                  content={`-${discountPercentage}%`}
                  color="danger"
                  placement="top-right"
                  className="absolute top-2 right-2"
                />
              )}
            </div>

            <div className="p-3">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    icon="lucide:star"
                    className={
                      i < Math.floor(displayRating)
                        ? "text-warning-500 text-xs fill-current"
                        : "text-default-300 text-xs"
                    }
                  />
                ))}
                <span className="text-tiny text-default-500 ml-1">
                  ({displayReviewCount})
                </span>
              </div>

              <h3 className="font-medium text-sm line-clamp-1">
                {product.name}
              </h3>
              {displayBrand && (
                <p className="text-tiny text-default-500 mb-2">
                  {displayBrand}
                </p>
              )}

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
                <span className="font-semibold">
                  {formatPrice(displayPrice)}
                </span>
                {hasProductDiscount &&
                  (product.originalPrice || product.price > displayPrice) && (
                    <span className="text-default-400 text-tiny line-through">
                      {formatPrice(product.originalPrice || product.price)}
                    </span>
                  )}
              </div>
            </div>
          </Link>

          {/* Add to Cart Button - Outside of Link */}
          <div className="absolute bottom-2 right-2">
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
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
