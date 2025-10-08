'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../src/context/AuthContext';
import { Spinner } from '@heroui/react';

import AdminAppWrapper from '../../../../src/admin/AdminAppWrapper';
import { DashboardPage } from '../../../../src/admin/pages/dashboard-page';
import { HeroPage } from '../../../../src/admin/pages/hero-page';
import { ProductListPage } from '../../../../src/admin/pages/products-page';
import { ProductFormPage } from '../../../../src/admin/pages/product-form-page';
import { OrdersPage } from '../../../../src/admin/pages/orders-page';
import { OrderDetailPage } from '../../../../src/admin/pages/order-detail-page';
import { OrderFormPage } from '../../../../src/admin/pages/order-form-page';
import { LoginPage } from '../../../../src/admin/pages/login-page';

import { AuthProvider } from '../../../../src/context/AuthContext';

function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const slug = params.slug || [];
  const page = slug[0] || 'dashboard';
  const id = slug[1] === 'edit' ? slug[2] : slug[1];

  useEffect(() => {
    if (!isLoading && !isAuthenticated && page !== 'login') {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, page, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && page === 'login') {
      router.push('/admin/dashboard');
    }
  }, [isLoading, isAuthenticated, page, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" color="primary" label="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated && page !== 'login') {
    return null;
  }

  if (isAuthenticated && page === 'login') {
    return null;
  }

  if (page === 'login') {
    return <LoginPage />;
  }

  let content = <div>Page not found</div>;

  switch (page) {
    case 'dashboard':
      content = <DashboardPage />;
      break;
    case 'hero':
      content = <HeroPage />;
      break;
    case 'products':
      if (slug[1] === 'new') {
        content = <ProductFormPage />;
      } else if (slug[2] === 'edit') {
        content = <ProductFormPage />;
      } else {
        content = <ProductListPage />;
      }
      break;
    case 'orders':
      if (slug[1] === 'new') {
        content = <OrderFormPage />;
      } else if (id) {
        content = <OrderDetailPage id={id} />;
      } else {
        content = <OrdersPage />;
      }
      break;
  }

  return (
    <AdminAppWrapper>
      {content}
    </AdminAppWrapper>
  );
}

export default function AdminPageWithProvider() {
  return (
    <AuthProvider>
      <AdminPage />
    </AuthProvider>
  );
}