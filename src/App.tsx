import React from "react";
import { Switch, Route } from "react-router-dom";
import { motion } from "framer-motion";

// Context hooks
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import { useUI } from "./context/UIContext";

// Layouts
import MainLayout from "./layouts/main-layout";

// Pages
import HomePage from "./pages/home";
import ProductListPage from "./pages/product-list";
import ProductDetailPage from "./pages/product-detail";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import AccountPage from "./pages/account";
import NotFoundPage from "./pages/not-found";
import StateDemoPage from "./pages/state-demo";

const App: React.FC = () => {
  const { isAuthenticated, state: authState } = useAuth();
  const { state: cartState } = useCart();
  const { state: uiState } = useUI();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <MainLayout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/products" component={ProductListPage} />
          <Route exact path="/products/:category" component={ProductListPage} />
          <Route exact path="/product/:id" component={ProductDetailPage} />
          <Route exact path="/cart" component={CartPage} />
          <Route exact path="/checkout" component={CheckoutPage} />
          <Route exact path="/account" component={AccountPage} />
          <Route exact path="/demo" component={StateDemoPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </MainLayout>
    </motion.div>
  );
};

export default App;
