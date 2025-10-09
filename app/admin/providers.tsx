'use client';

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AuthProvider } from '../../src/admin/context/auth-context';

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </HeroUIProvider>
  );
}
