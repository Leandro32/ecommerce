import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { LoginCredentials, RegisterData, User } from '../types/auth';

export const useAuthOperations = () => {
  const {
    login,
    register,
    logout,
    updateUser,
    clearError,
    state,
    isAuthenticated,
    user,
    token
  } = useAuth();
  const { showSuccess, showError, showInfo } = useUI();

  const loginUser = useCallback(async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      showSuccess(`Welcome back, ${credentials.email}!`);
      return true;
    } catch (error: unknown) {
      showError((error as Error)?.message ?? 'Login failed');
      return false;
    }
  }, [login, showSuccess, showError]);

  const registerUser = useCallback(async (data: RegisterData) => {
    try {
      await register(data);
      showSuccess(`Welcome, ${data.firstName}! Your account has been created.`);
      return true;
    } catch (error: unknown) {
      showError((error as Error)?.message ?? 'Registration failed');
      return false;
    }
  }, [register, showSuccess, showError]);

  const logoutUser = useCallback(() => {
    try {
      logout();
      showInfo('You have been logged out successfully');
      return true;
    } catch {
      showError('Failed to logout');
      return false;
    }
  }, [logout, showInfo, showError]);

  const updateUserProfile = useCallback(async (userData: Partial<User>) => {
    try {
      updateUser(userData);
      showSuccess('Profile updated successfully');
      return true;
    } catch {
      showError('Failed to update profile');
      return false;
    }
  }, [updateUser, showSuccess, showError]);

  const clearAuthError = useCallback(() => {
    clearError();
  }, [clearError]);

  const getAuthHeaders = useCallback(() => {
    if (!token) return {};

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, [token]);

  const isTokenExpired = useCallback(() => {
    if (!token) return true;

    try {
      // For a real JWT token, you would decode and check the exp claim
      // This is a simple mock implementation
      const tokenParts = token.split('-');
      if (tokenParts.length < 3) return true;

      const timestamp = parseInt(tokenParts[2], 10);
      const now = Date.now();
      const tokenAge = now - timestamp;

      // Consider token expired after 24 hours (86400000 ms)
      return tokenAge > 86400000;
    } catch {
      return true;
    }
  }, [token]);

  const refreshTokenIfNeeded = useCallback(async () => {
    if (!isAuthenticated || !isTokenExpired()) {
      return true;
    }

    try {
      // In a real app, you would call a refresh token endpoint
      // For now, we'll just logout the user
      logoutUser();
      showError('Your session has expired. Please log in again.');
      return false;
    } catch {
      logoutUser();
      return false;
    }
  }, [isAuthenticated, isTokenExpired, logoutUser, showError]);

  const getUserDisplayName = useCallback(() => {
    if (!user) return '';

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    if (user.firstName) {
      return user.firstName;
    }

    return user.email;
  }, [user]);

  const getUserInitials = useCallback(() => {
    if (!user) return '';

    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }

    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }

    return user.email.charAt(0).toUpperCase();
  }, [user]);

  const hasPermission = useCallback(() => {
    // In a real app, you would check user roles/permissions
    // For now, all authenticated users have all permissions
    return isAuthenticated;
  }, [isAuthenticated]);

  return {
    // Authentication operations
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    clearAuthError,
    refreshTokenIfNeeded,

    // Utility functions
    getAuthHeaders,
    isTokenExpired,
    getUserDisplayName,
    getUserInitials,
    hasPermission,

    // State
    authState: state,
    isAuthenticated,
    user,
    token,
    isLoading: state.isLoading,
    error: state.error,
  };
};

export default useAuthOperations;
