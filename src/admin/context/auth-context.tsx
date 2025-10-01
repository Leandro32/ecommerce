'use client';

import React from "react";
import { addToast } from "@heroui/react";
import { useSession, signIn, signOut } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        addToast({
          title: "Login Failed",
          description: result.error,
          severity: "danger"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      addToast({
        title: "Login Error",
        description: "An unexpected error occurred",
        severity: "danger"
      });
      return false;
    }
  };

  const logout = () => {
    signOut();
    addToast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      severity: "success"
    });
  };

  const user = session?.user ? {
    id: (session.user as any).id || '',
    name: session.user.name || '',
    email: session.user.email || '',
    role: 'admin',
  } : null;

  const value = {
    user,
    isLoading: status === 'loading',
    login,
    logout,
    isAuthenticated: status === 'authenticated'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};