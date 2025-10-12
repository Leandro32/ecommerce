import React from 'react';
import { Button, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useCart } from '@/context/CartContext';
import { Product } from '../types/product';

// Test product for debugging
const testProduct: Product = {
  id: 'test-product-1',
  name: 'Test Product',
  description: 'A test product for debugging cart functionality',
  price: 19.99,
  originalPrice: 24.99,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
  brand: 'Test Brand',
  category: 'Test Category',
  rating: 4.0,
  reviewCount: 42,
  isNew: true,
  discount: 20,
  stock: 100,
  sku: 'TEST-001',
};

const CartDebug: React.FC = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartTotal,
    cartOriginalTotal,
    cartSavings,
    state,
    totalItems,
    isLoading,
    error
  } = useCart();

  const handleAddTestProduct = () => {
    console.log('Adding test product to cart');
    addToCart(testProduct, 1, { color: 'Red', size: 'L' });
  };

  const handleAddTestProductNoVariant = () => {
    console.log('Adding test product without variant');
    addToCart(testProduct, 2);
  };

  const handleClearCart = () => {
    console.log('Clearing cart');
    clearCart();
  };

  const handleCheckLocalStorage = () => {
    const savedCart = localStorage.getItem('ecommerce-cart');
    console.log('LocalStorage cart data:', savedCart);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        console.log('Parsed cart data:', parsed);
      } catch (error) {
        console.error('Failed to parse localStorage cart:', error);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex gap-3">
        <Icon icon="heroicons:bug-ant" className="text-2xl" />
        <div className="flex flex-col">
          <p className="text-md font-semibold">Cart Debug Panel</p>
          <p className="text-small text-default-500">Testing cart state management</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-4">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            color="primary"
            size="sm"
            onPress={handleAddTestProduct}
            startContent={<Icon icon="heroicons:plus" />}
          >
            Add Test Product (with variant)
          </Button>
          <Button
            color="secondary"
            size="sm"
            onPress={handleAddTestProductNoVariant}
            startContent={<Icon icon="heroicons:plus-circle" />}
          >
            Add Test Product (no variant)
          </Button>
          <Button
            color="danger"
            size="sm"
            variant="flat"
            onPress={handleClearCart}
            startContent={<Icon icon="heroicons:trash" />}
          >
            Clear Cart
          </Button>
          <Button
            color="warning"
            size="sm"
            variant="flat"
            onPress={handleCheckLocalStorage}
            startContent={<Icon icon="heroicons:magnifying-glass" />}
          >
            Check localStorage
          </Button>
        </div>

        {/* Cart Summary */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-default-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Cart Items: {cartItems.length}</p>
            <p className="text-sm font-medium">Total Items: {totalItems}</p>
            <p className="text-sm font-medium">Cart Total: ${cartTotal.toFixed(2)}</p>
            <p className="text-sm font-medium">Original Total: ${cartOriginalTotal.toFixed(2)}</p>
            <p className="text-sm font-medium">Savings: ${cartSavings.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm">Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p className="text-sm">Error: {error || 'None'}</p>
            <p className="text-sm">State Total Price: ${state.totalPrice.toFixed(2)}</p>
            <p className="text-sm">State Total Items: {state.totalItems}</p>
          </div>
        </div>

        {/* Cart Items List */}
        {cartItems.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium">Cart Items:</h4>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-default-100 rounded">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-default-600">
                    ID: {item.id} | Qty: {item.quantity} | Price: ${item.product.price}
                  </p>
                  {item.variant && (
                    <p className="text-xs text-default-500">
                      Variant: {item.variant.color || 'N/A'} - {item.variant.size || 'N/A'}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-default-500">
            <Icon icon="heroicons:shopping-cart" className="text-3xl mb-2" />
            <p>Cart is empty</p>
          </div>
        )}

        {/* Raw State Debug */}
        <div className="space-y-2">
          <h4 className="font-medium">Raw State (for debugging):</h4>
          <pre className="text-xs bg-default-100 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify({
              cartItems: cartItems.map(item => ({
                id: item.id,
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                variant: item.variant
              })),
              state: {
                items: state.items.length,
                totalItems: state.totalItems,
                totalPrice: state.totalPrice,
                isLoading: state.isLoading,
                error: state.error
              }
            }, null, 2)}
          </pre>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-warning-50 rounded-lg">
          <p className="text-sm text-warning-800 font-medium mb-1">Debug Instructions:</p>
          <ol className="text-xs text-warning-700 space-y-1">
            <li>1. Open browser dev tools (F12) and check Console tab</li>
            <li>2. Add items to cart and watch console logs</li>
            <li>3. Navigate to /cart and back to see if state persists</li>
            <li>4. Check localStorage to see if data is saved</li>
            <li>5. Refresh page to test localStorage restore</li>
          </ol>
        </div>
      </CardBody>
    </Card>
  );
};

export default CartDebug;
