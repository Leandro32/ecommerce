import { UIState, UIAction } from '../types/store';

export const initialUIState: UIState = {
  theme: 'system',
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchQuery: '',
  notifications: [],
};

export const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case 'TOGGLE_MOBILE_MENU':
      return {
        ...state,
        mobileMenuOpen: !state.mobileMenuOpen,
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'ADD_NOTIFICATION': {
      const newNotification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };

      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      };
    }

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
};
