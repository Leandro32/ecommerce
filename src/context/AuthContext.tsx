import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthAction, LoginCredentials, RegisterData, User } from '../types/auth';
import { authReducer, initialAuthState } from '../store/authReducer';

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'ecommerce-auth-token';
const AUTH_USER_KEY = 'ecommerce-auth-user';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userString = localStorage.getItem(AUTH_USER_KEY);

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        });
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
  }, []);

  // Save auth data to localStorage when state changes
  useEffect(() => {
    if (state.isAuthenticated && state.user && state.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, state.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(state.user));
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [state.isAuthenticated, state.user, state.token]);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Make API call to login endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { user, token } = await response.json();

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
    } catch (error) {
      // For demo purposes, simulate authentication
      const mockUsers = {
        'demo@example.com': {
          id: '1',
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          avatar: '',
          phone: '+1234567890',
          addresses: [],
          preferences: {
            theme: 'system' as const,
            language: 'en',
            currency: 'USD',
            notifications: {
              email: true,
              sms: false,
              push: true,
            },
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      };

      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const user = mockUsers['demo@example.com'];
        const token = 'mock-jwt-token-' + Date.now();

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        });
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: error instanceof Error ? error.message : 'Login failed'
        });
      }
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Make API call to register endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const { user, token } = await response.json();

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
    } catch (error) {
      // For demo purposes, simulate successful registration
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        addresses: [],
        preferences: {
          theme: 'system',
          language: 'en',
          currency: 'USD',
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = 'mock-jwt-token-' + Date.now();

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: newUser, token }
      });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    state,
    dispatch,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    token: state.token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
