'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CartItem from '../../../src/components/cart-item';
import { useCart } from '../../../src/context/CartContext';

const CartPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { cartItems, cartTotal, cartOriginalTotal, cartSavings, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <Icon icon="lucide:shopping-cart" className="text-6xl text-default-300 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">{t('cart.emptyTitle')}</h1>
        <p className="text-default-500 mb-8 text-center max-w-md">
          {t('cart.emptyMessage')}
        </p>
        <Button 
          as={Link}
          href="/products"
          color="primary"
          size="lg"
          className="font-medium mt-8"
        >
          {t('buttons.startShopping')}
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
      <h1 className="text-2xl font-semibold mb-6">{t('cart.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <div className="flex justify-between items-center mb-4">
                <p className="text-default-500">
                  {cartItems.length} {cartItems.length === 1 ? t('units.item') : t('units.items')}
                </p>
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={clearCart}
                  startContent={<Icon icon="lucide:trash-2" className="text-sm" />}
                >
                  {t('buttons.clearCart')}
                </Button>
              </div>
              
              <Divider className="mb-4" />
              
              <div>
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">{t('cart.orderSummary')}</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-default-600">{t('labels.subtotal')}</span>
                  <span>${cartOriginalTotal.toFixed(2)}</span>
                </div>
                
                {cartSavings > 0 && (
                  <div className="flex justify-between text-success">
                    <span>{t('cart.savings')}</span>
                    <span>-${cartSavings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-default-600">{t('labels.shipping')}</span>
                  <span>{t('cart.free')}</span>
                </div>
                
                <Divider />
                
                <div className="flex justify-between font-semibold">
                  <span>{t('labels.total')}</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                as={Link}
                href="/checkout"
                color="primary"
                size="lg"
                fullWidth
                className="font-medium"
              >
                {t('buttons.proceedToCheckout')}
              </Button>
              
              <div className="mt-4">
                <Button
                  as={Link}
                  href="/products"
                  variant="flat"
                  fullWidth
                  startContent={<Icon icon="lucide:arrow-left" className="text-sm" />}
                >
                  {t('buttons.continueShopping')}
                </Button>
              </div>
              
              <div className="mt-6">
                <p className="text-tiny text-default-500 mb-2">{t('cart.weAccept')}</p>
                <div className="flex gap-2">
                  <Icon icon="logos:visa" className="text-2xl" />
                  <Icon icon="logos:mastercard" className="text-2xl" />
                  <Icon icon="logos:paypal" className="text-2xl" />
                  <Icon icon="logos:apple-pay" className="text-2xl" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
