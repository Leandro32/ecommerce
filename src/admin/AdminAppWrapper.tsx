"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AdminLayout } from "./components/layout/admin-layout";

export default function AdminAppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <AdminLayout>{children}</AdminLayout>
    </HeroUIProvider>
  );
}