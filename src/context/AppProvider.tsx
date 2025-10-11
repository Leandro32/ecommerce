'use client';

import React, { ReactNode } from 'react';
import { CartProvider } from './CartContext';
import { UIProvider } from './UIContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <UIProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </UIProvider>
  );
};

export default AppProvider;
