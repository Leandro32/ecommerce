import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { UIState, UIAction, Notification } from '../types/store';
import { uiReducer, initialUIState } from '../store/uiReducer';

interface UIContextType {
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setSearchQuery: (query: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const UI_STORAGE_KEY = 'ecommerce-ui-preferences';

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);

  // Load UI preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(UI_STORAGE_KEY);
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        if (parsed.theme) {
          dispatch({ type: 'SET_THEME', payload: parsed.theme });
        }
      } catch (error) {
        console.error('Failed to parse UI preferences:', error);
      }
    }
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    const preferences = {
      theme: state.theme,
    };
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(preferences));
  }, [state.theme]);

  // Handle system theme changes
  useEffect(() => {
    if (state.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      };

      handleChange(); // Set initial state
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    }
  }, [state.theme]);

  // Auto-remove notifications after their duration
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    state.notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
        }, notification.duration);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [state.notifications]);

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const toggleMobileMenu = () => {
    dispatch({ type: 'TOGGLE_MOBILE_MENU' });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const showSuccess = (message: string, title: string = 'Success') => {
    addNotification({
      type: 'success',
      title,
      message,
      duration: 5000,
    });
  };

  const showError = (message: string, title: string = 'Error') => {
    addNotification({
      type: 'error',
      title,
      message,
      duration: 7000,
    });
  };

  const showWarning = (message: string, title: string = 'Warning') => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000,
    });
  };

  const showInfo = (message: string, title: string = 'Info') => {
    addNotification({
      type: 'info',
      title,
      message,
      duration: 4000,
    });
  };

  const value: UIContextType = {
    state,
    dispatch,
    setTheme,
    toggleSidebar,
    toggleMobileMenu,
    setSearchQuery,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export default UIContext;
