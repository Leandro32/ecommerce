"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import "./globals.css"; // Import global styles here

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}