import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/layout/admin-layout";
import { LoginPage } from "./pages/login-page";
import { DashboardPage } from "./pages/dashboard-page";
import { ProductListPage } from "./pages/products-page";
import { ProductFormPage } from "./pages/product-form-page";
import { OrdersPage } from "./pages/orders-page";
import { OrderDetailPage } from "./pages/order-detail-page";
import { OrderFormPage } from "./pages/order-form-page";
import { HeroPage } from "./pages/hero-page";
import { ProtectedRoute } from "./components/auth/protected-route";

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="hero" element={<HeroPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="orders/new" element={<OrderFormPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}