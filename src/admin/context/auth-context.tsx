'use client';

import React from "react";
import { addToast } from "@heroui/react";

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
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login with mock data
      if (email === "admin@example.com" && password === "password") {
        const userData: User = {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin"
        };
        
        setUser(userData);
        localStorage.setItem("admin_user", JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }
      
      addToast({
        title: "Login Failed",
        description: "Invalid email or password",
        severity: "danger"
      });
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      addToast({
        title: "Login Error",
        description: "An unexpected error occurred",
        severity: "danger"
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("admin_user");
    addToast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      severity: "success"
    });
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
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