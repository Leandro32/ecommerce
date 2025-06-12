import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import CartItem from '../components/cart-item';
import { useCart } from '../hooks/use-cart';

const CartPage: React.FC = () => {
  const { cartItems, cartTotal, cartOriginalTotal, cartSavings, clearCart } = useCart();
  
  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <Icon icon="lucide:shopping-cart" className="text-6xl text-default-300 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-default-500 mb-8 text-center max-w-md">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button 
          as={Link}
          to="/products"
          color="primary"
          size="lg"
          className="font-medium"
        >
          Start Shopping
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
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <div className="flex justify-between items-center mb-4">
                <p className="text-default-500">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={clearCart}
                  startContent={<Icon icon="lucide:trash-2" className="text-sm" />}
                >
                  Clear Cart
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
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-default-600">Subtotal</span>
                  <span>${cartOriginalTotal.toFixed(2)}</span>
                </div>
                
                {cartSavings > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Savings</span>
                    <span>-${cartSavings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-default-600">Shipping</span>
                  <span>Free</span>
                </div>
                
                <Divider />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                as={Link}
                to="/checkout"
                color="primary"
                size="lg"
                fullWidth
                className="font-medium"
              >
                Proceed to Checkout
              </Button>
              
              <div className="mt-4">
                <Button
                  as={Link}
                  to="/products"
                  variant="flat"
                  fullWidth
                  startContent={<Icon icon="lucide:arrow-left" className="text-sm" />}
                >
                  Continue Shopping
                </Button>
              </div>
              
              <div className="mt-6">
                <p className="text-tiny text-default-500 mb-2">We accept:</p>
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