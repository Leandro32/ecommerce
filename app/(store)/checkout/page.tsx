'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useCart } from '../../../src/context/CartContext';
import { addToast } from '@heroui/react';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const [orderPlaced, setOrderPlaced] = React.useState(false);

  React.useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      router.push('/cart');
    }
  }, [cartItems, router, orderPlaced]);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        customerName: 'Guest User', // Or get from a form
        items: cartItems.map(item => ({ 
          productId: item.product.id, 
          quantity: item.quantity 
        })),
      };

      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to place order');
      }

      addToast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
        color: "success",
      });
      clearCart();
      setOrderPlaced(true);

    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "There was an error placing your order. Please try again.",
        color: "danger",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 text-center"
      >
        <Icon icon="lucide:check-circle" className="text-6xl text-success mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">¡Gracias por tu compra!</h1>
        <p className="text-default-500 mb-8 max-w-md mx-auto">
          Your order has been placed successfully.
        </p>
        <Button
          as={Link}
          href="/products"
          variant="flat"
        >
          Continue Shopping
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-6"
    >
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <p className="text-default-600">
                You are about to checkout with {cartItems.length} items.
                Review your order on the right and proceed to place your order.
              </p>
            </CardBody>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-20">
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="max-h-[300px] overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-divider">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.product.image || ''} 
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full text-tiny">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Divider className="my-4" />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <Button
                color="primary"
                size="lg"
                fullWidth
                className="font-medium mt-4"
                onPress={handlePlaceOrder}
                isLoading={isPlacingOrder}
              >
                Place Order
              </Button>
              
              <div className="mt-4">
                <Button
                  as={Link}
                  href="/cart"
                  variant="flat"
                  fullWidth
                  startContent={<Icon icon="lucide:arrow-left" className="text-sm" />}
                >
                  Return to Cart
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
