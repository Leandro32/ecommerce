import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Button, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useCart } from "../hooks/use-cart";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link to={`/product/${product.id}`} className="block">
        <Card className="overflow-visible h-full" isPressable disableRipple>
          {/* Rest of your card content remains the same */}
          {/* <Card
        className="overflow-visible h-full"
        isPressable
        disableRipple
        as={Link}
        to={`/product/${product.id}`}
      > */}
          <CardBody className="p-0 overflow-visible">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-[3/4] object-cover rounded-t-lg"
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
              <Button
                isIconOnly
                radius="full"
                variant="flat"
                color="primary"
                size="sm"
                className="absolute bottom-2 right-2 shadow-md"
                onPress={handleAddToCart}
                aria-label="Add to cart"
              >
                <Icon icon="lucide:shopping-cart" />
              </Button>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    icon={
                      i < Math.floor(product.rating)
                        ? "lucide:star"
                        : "lucide:star"
                    }
                    className={
                      i < Math.floor(product.rating)
                        ? "text-warning-500 text-xs"
                        : "text-default-300 text-xs"
                    }
                  />
                ))}
                <span className="text-tiny text-default-500 ml-1">
                  ({product.reviewCount})
                </span>
              </div>

              <h3 className="font-medium text-sm line-clamp-1">
                {product.name}
              </h3>
              <p className="text-tiny text-default-500 mb-2">{product.brand}</p>

              <div className="flex items-center gap-2">
                {product.originalPrice &&
                product.originalPrice > product.price ? (
                  <>
                    <span className="font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-default-400 text-tiny line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
