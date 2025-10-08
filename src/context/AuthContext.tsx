"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { LoginCredentials, RegisterData, User } from "../types/auth";

interface AuthContextType {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void; // This will need to interact with NextAuth's update
  clearError: () => void; // This might become redundant or need re-implementation
  isAuthenticated: boolean;
  user: User | null;
  token: string | null; // This might not be directly available from NextAuth.js session
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status, update } = useSession();

  const isAuthenticated = status === 'authenticated';
  const user = session?.user || null;
  const token = (session as any)?.accessToken || null; // Accessing accessToken if available

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      // After successful sign-in, the session will automatically update
      // No need for local dispatch for AUTH_SUCCESS here

    } catch (error: any) {
      console.error("Login error:", error);
      // Here you might want to set a local error state if needed for UI feedback
      throw error; // Re-throw to be caught by the calling component
    }
  };

  const register = async (data: RegisterData) => {
    // This register function is currently a mock and does not use NextAuth.js
    // If you want to integrate registration with NextAuth.js, you would need
    // a custom API route for registration and then potentially sign in the user.
    console.warn("Register function is a mock and does not use NextAuth.js");
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // After successful registration, you might want to automatically log in the user
      await login({ email: data.email, password: data.password });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    // After successful sign-out, the session will automatically update
  };

  const updateUser = async (userData: Partial<User>) => {
    // This function would typically update the user in your backend
    // and then update the NextAuth.js session if the user data is part of it.
    // Example: await update({ user: { ...session.user, ...userData } });
    console.warn("updateUser function is a placeholder and needs implementation");
    if (update) {
      await update({ user: { ...session?.user, ...userData } });
    }
  };

  const clearError = () => {
    // With useSession, error handling is typically done locally in components
    // or through the signIn function's result. This might become redundant.
    console.warn("clearError function is a placeholder and might be redundant");
  };

  const value: AuthContextType = {
    session,
    status,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated,
    user,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
