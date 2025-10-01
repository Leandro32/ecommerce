'use client';

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AuthProvider } from '../../src/admin/context/auth-context';
import { SessionProvider } from "next-auth/react";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HeroUIProvider>
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}
