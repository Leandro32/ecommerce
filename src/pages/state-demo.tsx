import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  useAuth,
  useCart,
  useUI,
  useAuthOperations,
  useCartOperations,
} from "../hooks";
import { Product } from "../types/product";

// Mock product data for demo
const mockProduct: Product = {
  id: "demo-product-1",
  name: "Demo Product",
  description: "A sample product for testing our state management",
  price: 29.99,
  originalPrice: 39.99,
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  brand: "Demo Brand",
  category: "Electronics",
  rating: 4.5,
  reviewCount: 128,
  isNew: true,
  discount: 25,
  stock: 50,
  sku: "DEMO-001",
};

const StateDemoPage: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState("demo@example.com");
  const [loginPassword, setLoginPassword] = useState("password");
  const [couponCode, setCouponCode] = useState("SAVE10");

  // Context hooks
  const { state: authState, isAuthenticated, user } = useAuth();
  const { state: cartState } = useCart();
  const {
    state: uiState,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useUI();

  // Operation hooks
  const { loginUser, logoutUser, getUserDisplayName } = useAuthOperations();
  const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } =
    useCart();

  const handleLogin = async () => {
    await loginUser({ email: loginEmail, password: loginPassword });
  };

  const handleLogout = () => {
    logoutUser();
  };

  const handleAddToCart = () => {
    addToCart(mockProduct, 1, { color: "Blue", size: "M" });
  };

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleApplyCoupon = async () => {
    try {
      // This would use the cart context's applyCoupon method
      showInfo(`Coupon "${couponCode}" applied!`);
    } catch (error) {
      showError("Failed to apply coupon");
    }
  };

  const cartSummary = {
    itemCount: cartState.totalItems,
    subtotal: cartState.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ),
    discount: 0,
    tax: cartState.estimatedTax,
    shipping: cartState.estimatedShipping,
    total: cartState.totalPrice,
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-foreground mb-4">
          State Management Demo
        </h1>
        <p className="text-lg text-default-600">
          Showcasing our new Context-based state management system
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Authentication Demo */}
        <Card>
          <CardHeader className="flex gap-3">
            <Icon icon="heroicons:user-circle" className="text-2xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Authentication State</p>
              <p className="text-small text-default-500">
                Login/Logout functionality
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="p-3 bg-success-50 rounded-lg">
                  <p className="text-sm font-medium text-success-800">
                    Welcome, {getUserDisplayName()}!
                  </p>
                  <p className="text-xs text-success-600">{user?.email}</p>
                </div>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={handleLogout}
                  startContent={
                    <Icon icon="heroicons:arrow-right-on-rectangle" />
                  }
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onValueChange={setLoginEmail}
                  type="email"
                />
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onValueChange={setLoginPassword}
                  type="password"
                />
                <Button
                  color="primary"
                  onPress={handleLogin}
                  isLoading={authState.isLoading}
                  startContent={
                    <Icon icon="heroicons:arrow-left-on-rectangle" />
                  }
                >
                  Login
                </Button>
                <p className="text-xs text-default-500">
                  Use demo@example.com / password to login
                </p>
              </div>
            )}

            {authState.error && (
              <div className="p-3 bg-danger-50 rounded-lg">
                <p className="text-sm text-danger-800">{authState.error}</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Cart Demo */}
        <Card>
          <CardHeader className="flex gap-3">
            <Icon icon="heroicons:shopping-cart" className="text-2xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Cart State</p>
              <p className="text-small text-default-500">
                {cartSummary.itemCount} items - ${cartSummary.total.toFixed(2)}
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            {/* Demo Product */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <img
                src={mockProduct.image}
                alt={mockProduct.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-grow">
                <h4 className="font-medium">{mockProduct.name}</h4>
                <p className="text-sm text-default-600">${mockProduct.price}</p>
              </div>
              <Button
                size="sm"
                color="primary"
                onPress={handleAddToCart}
                startContent={<Icon icon="heroicons:plus" />}
              >
                Add to Cart
              </Button>
            </div>

            {/* Cart Items */}
            {cartState.items.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium">Cart Items:</h4>
                {cartState.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-default-50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-default-600">
                        {item.variant?.color && `${item.variant.color} - `}
                        {item.variant?.size && `${item.variant.size} - `}
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() =>
                          updateCartItemQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                      >
                        <Icon icon="heroicons:minus" />
                      </Button>
                      <span className="text-sm min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() =>
                          updateCartItemQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Icon icon="heroicons:plus" />
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        isIconOnly
                        onPress={() => handleRemoveFromCart(item.id)}
                      >
                        <Icon icon="heroicons:trash" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Cart Summary */}
                <div className="p-3 bg-primary-50 rounded-lg space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${cartSummary.subtotal.toFixed(2)}</span>
                  </div>
                  {cartSummary.discount > 0 && (
                    <div className="flex justify-between text-sm text-success-600">
                      <span>Discount:</span>
                      <span>-${cartSummary.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${cartSummary.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>${cartSummary.shipping.toFixed(2)}</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${cartSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  color="danger"
                  variant="flat"
                  onPress={clearCart}
                  startContent={<Icon icon="heroicons:trash" />}
                >
                  Clear Cart
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-default-500">
                <Icon
                  icon="heroicons:shopping-cart"
                  className="text-4xl mb-2"
                />
                <p>Your cart is empty</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* UI State Demo */}
        <Card>
          <CardHeader className="flex gap-3">
            <Icon icon="heroicons:bell" className="text-2xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">UI State & Notifications</p>
              <p className="text-small text-default-500">
                Theme: {uiState.theme}
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                color="success"
                variant="flat"
                onPress={() =>
                  showSuccess("Success notification!", "Well done!")
                }
              >
                Success
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onPress={() => showError("Error notification!", "Oops!")}
              >
                Error
              </Button>
              <Button
                size="sm"
                color="warning"
                variant="flat"
                onPress={() =>
                  showWarning("Warning notification!", "Heads up!")
                }
              >
                Warning
              </Button>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={() => showInfo("Info notification!", "FYI")}
              >
                Info
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                Active Notifications: {uiState.notifications.length}
              </p>
              {uiState.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="text-xs text-default-600 p-2 bg-default-50 rounded"
                >
                  <strong>{notification.title}:</strong> {notification.message}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Coupon Demo */}
        <Card>
          <CardHeader className="flex gap-3">
            <Icon icon="heroicons:ticket" className="text-2xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Coupon System</p>
              <p className="text-small text-default-500">
                Test coupon functionality
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onValueChange={setCouponCode}
                size="sm"
              />
              <Button size="sm" color="secondary" onPress={handleApplyCoupon}>
                Apply
              </Button>
            </div>

            <div className="text-xs text-default-500 space-y-1">
              <p>
                <strong>Available codes:</strong>
              </p>
              <p>• SAVE10 - 10% off orders over $50</p>
              <p>• FREESHIP - Free shipping</p>
              <p>• WELCOME20 - 20% off (max $50 discount)</p>
            </div>

            {cartState.appliedCoupon && (
              <div className="p-3 bg-success-50 rounded-lg">
                <p className="text-sm font-medium text-success-800">
                  Coupon Applied: {cartState.appliedCoupon.code}
                </p>
                <p className="text-xs text-success-600">
                  {cartState.appliedCoupon.description}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* State Debug Panel */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Debug: Current State</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <h4 className="font-medium mb-2">Auth State</h4>
              <pre className="bg-default-100 p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    isAuthenticated,
                    user: user
                      ? {
                          email: user.email,
                          name: `${user.firstName} ${user.lastName}`,
                        }
                      : null,
                    isLoading: authState.isLoading,
                    error: authState.error,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Cart State</h4>
              <pre className="bg-default-100 p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    itemCount: cartState.totalItems,
                    totalPrice: cartState.totalPrice,
                    appliedCoupon: cartState.appliedCoupon?.code,
                    isLoading: cartState.isLoading,
                    error: cartState.error,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">UI State</h4>
              <pre className="bg-default-100 p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    theme: uiState.theme,
                    notificationCount: uiState.notifications.length,
                    searchQuery: uiState.searchQuery,
                    sidebarOpen: uiState.sidebarOpen,
                    mobileMenuOpen: uiState.mobileMenuOpen,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StateDemoPage;
