import React from "react";
import Link from "next/link";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { CartItem as CartItemType } from "../types/cart";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItemQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      updateCartItemQuantity(item.id, quantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b border-divider">
      <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
        <Link href={`/product/${item.product.id}`}>
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            <Link href={`/product/${item.product.id}`}>
              <h3 className="font-medium text-sm sm:text-base hover:text-primary transition-colors">
                {item.product.name}
              </h3>
            </Link>
            <p className="text-tiny text-default-500">{item.product.brand}</p>

            {item.variant && (
              <div className="flex items-center gap-2 mt-1">
                {item.variant.color && (
                  <div className="flex items-center gap-1">
                    <span className="text-tiny text-default-500">Color:</span>
                    <span className="text-tiny">{item.variant.color}</span>
                  </div>
                )}

                {item.variant.size && (
                  <div className="flex items-center gap-1">
                    <span className="text-tiny text-default-500">Size:</span>
                    <span className="text-tiny">{item.variant.size}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 mt-3 sm:mt-0">
            <div className="flex items-center">
              <Input
                type="number"
                value={item.quantity.toString()}
                onValueChange={handleQuantityChange}
                min={1}
                max={99}
                className="w-16"
                size="sm"
                classNames={{
                  inputWrapper: "h-8",
                }}
              />
            </div>

            <div className="flex items-center gap-1">
              <span className="font-semibold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>

              {item.product.originalPrice && (
                <span className="text-default-400 text-tiny line-through">
                  ${(item.product.originalPrice * item.quantity).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button
            size="sm"
            variant="light"
            color="danger"
            onPress={handleRemove}
            startContent={<Icon icon="lucide:trash-2" className="text-sm" />}
            className="text-tiny"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
