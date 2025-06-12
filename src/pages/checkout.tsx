// Create the missing CheckoutPage component
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Card, CardBody, Input, Checkbox, Divider, Radio, RadioGroup, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/use-cart';
import { addToast } from '@heroui/react';

const CheckoutPage: React.FC = () => {
  const history = useHistory();
  const { cartItems, cartTotal, cartOriginalTotal, cartSavings, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    paymentMethod: 'credit-card',
    saveInfo: true
  });
  
  React.useEffect(() => {
    if (cartItems.length === 0) {
      history.push('/cart');
    }
  }, [cartItems, history]);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      addToast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
        color: "success",
      });
      history.push('/');
    }, 2000);
  };
  
  if (cartItems.length === 0) {
    return null;
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
          <Card className="mb-6">
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onValueChange={(value) => handleInputChange('email', value)}
                className="mb-4"
                isRequired
              />
              <Checkbox
                isSelected={formData.saveInfo}
                onValueChange={(checked) => handleCheckboxChange('saveInfo', checked)}
              >
                Save this information for next time
              </Checkbox>
            </CardBody>
          </Card>
          
          <Card className="mb-6">
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onValueChange={(value) => handleInputChange('firstName', value)}
                  isRequired
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onValueChange={(value) => handleInputChange('lastName', value)}
                  isRequired
                />
              </div>
              <Input
                label="Address"
                value={formData.address}
                onValueChange={(value) => handleInputChange('address', value)}
                className="mb-4"
                isRequired
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  label="City"
                  value={formData.city}
                  onValueChange={(value) => handleInputChange('city', value)}
                  isRequired
                />
                <Input
                  label="State/Province"
                  value={formData.state}
                  onValueChange={(value) => handleInputChange('state', value)}
                  isRequired
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  label="ZIP/Postal Code"
                  value={formData.zipCode}
                  onValueChange={(value) => handleInputChange('zipCode', value)}
                  isRequired
                />
                <Input
                  label="Country"
                  value={formData.country}
                  onValueChange={(value) => handleInputChange('country', value)}
                  isRequired
                />
              </div>
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onValueChange={(value) => handleInputChange('phone', value)}
              />
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <Tabs aria-label="Payment Methods">
                <Tab key="card" title="Credit Card">
                  <div className="py-4">
                    <div className="flex gap-2 mb-4">
                      <Icon icon="logos:visa" className="text-2xl" />
                      <Icon icon="logos:mastercard" className="text-2xl" />
                      <Icon icon="logos:amex" className="text-2xl" />
                      <Icon icon="logos:discover" className="text-2xl" />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <Input
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        isRequired
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Expiration Date"
                          placeholder="MM/YY"
                          isRequired
                        />
                        <Input
                          label="Security Code"
                          placeholder="CVC"
                          isRequired
                        />
                      </div>
                      <Input
                        label="Name on Card"
                        placeholder="John Doe"
                        isRequired
                      />
                    </div>
                  </div>
                </Tab>
                <Tab key="paypal" title="PayPal">
                  <div className="py-4 flex flex-col items-center">
                    <Icon icon="logos:paypal" className="text-4xl mb-4" />
                    <p className="text-default-600 mb-4">
                      You will be redirected to PayPal to complete your purchase securely.
                    </p>
                    <Button color="primary">Continue with PayPal</Button>
                  </div>
                </Tab>
                <Tab key="applepay" title="Apple Pay">
                  <div className="py-4 flex flex-col items-center">
                    <Icon icon="logos:apple-pay" className="text-4xl mb-4" />
                    <p className="text-default-600 mb-4">
                      Pay with Apple Pay for fast and secure checkout.
                    </p>
                    <Button color="primary">Continue with Apple Pay</Button>
                  </div>
                </Tab>
              </Tabs>
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
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full text-tiny">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-tiny text-default-500">
                        {item.variant?.color && `${item.variant.color} / `}
                        {item.variant?.size && item.variant.size}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
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
                
                <div className="flex justify-between">
                  <span className="text-default-600">Tax</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
                
                <Divider />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(cartTotal + cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                color="primary"
                size="lg"
                fullWidth
                className="font-medium"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                type="submit"
              >
                Place Order
              </Button>
              
              <div className="mt-4">
                <Button
                  as={Link}
                  to="/cart"
                  variant="flat"
                  fullWidth
                  startContent={<Icon icon="lucide:arrow-left" className="text-sm" />}
                >
                  Return to Cart
                </Button>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-tiny text-default-500 mb-2">Secure Checkout</p>
                <div className="flex justify-center gap-2">
                  <Icon icon="lucide:lock" className="text-success text-sm" />
                  <span className="text-tiny">Your data is protected</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;