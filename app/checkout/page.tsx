'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useCart } from '../../src/hooks/use-cart';
import { addToast } from '@heroui/react';
import { saveOrder } from '../../src/utils/localOrderManager';
import { Order } from '../../src/types/order';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (cartItems.length === 0 && !order) {
      router.push('/cart');
    }
  }, [cartItems, router, order]);

  const handleWhatsAppCheckout = () => {
    setIsSaving(true);
    try {
      const newOrder = saveOrder(cartItems, cartTotal);
      setOrder(newOrder);
      addToast({
        title: "Order Saved!",
        description: "Your order has been saved locally. Now, send the message via WhatsApp to confirm.",
        color: "success",
      });
      clearCart();
    } catch {
      addToast({
        title: "Error",
        description: "There was an error saving your order. Please try again.",
        color: "danger",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateWhatsAppMessage = () => {
    if (!order) return '';

    const itemsText = order.items.map(item =>
      `• ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `Hola, buen dia!\nQuiero comprar estos productos:\n\n${itemsText}\n\n💰 *Total: $${order.total.toFixed(2)}*\n\nMuchas gracias!`;
    return encodeURIComponent(message);
  };

  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';

  if (order) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 text-center"
      >
        <Icon icon="lucide:check-circle" className="text-6xl text-success mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">¡Perfecto! Hemos guardado tu pedido.</h1>
        <p className="text-default-500 mb-8 max-w-md mx-auto">
          Ahora, envíanos el mensaje por WhatsApp para confirmar tu compra.
        </p>
        <Button
          as="a"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`}
          target="_blank"
          rel="noopener noreferrer"
          color="success"
          size="lg"
          className="font-medium"
          startContent={<Icon icon="logos:whatsapp-icon" />}
        >
          Confirmar por WhatsApp
        </Button>
        <div className="mt-4">
          <Button
            as={Link}
            href="/products"
            variant="flat"
          >
            Continue Shopping
          </Button>
        </div>
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
                Review your order on the right and proceed to confirm via WhatsApp.
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
                        src={item.product.image} 
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
                color="success"
                size="lg"
                fullWidth
                className="font-medium mt-4"
                onPress={handleWhatsAppCheckout}
                isLoading={isSaving}
                startContent={<Icon icon="logos:whatsapp-icon" />}
              >
                Checkout with WhatsApp
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
