import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useUI } from '../context/UIContext';

const NotificationToast: React.FC = () => {
  const { state, removeNotification } = useUI();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return 'heroicons:check-circle';
      case 'error':
        return 'heroicons:x-circle';
      case 'warning':
        return 'heroicons:exclamation-triangle';
      case 'info':
        return 'heroicons:information-circle';
      default:
        return 'heroicons:bell';
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColorForType = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      <AnimatePresence>
        {state.notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-lg border shadow-lg backdrop-blur-sm ${getColorForType(notification.type)}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon
                  icon={getIconForType(notification.type)}
                  className={`h-5 w-5 ${getIconColorForType(notification.type)}`}
                />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium">{notification.title}</h3>
                <p className="mt-1 text-sm opacity-90">{notification.message}</p>
                {notification.action && (
                  <div className="mt-2">
                    <button
                      onClick={notification.action.onClick}
                      className="text-sm font-medium underline hover:no-underline focus:outline-none"
                    >
                      {notification.action.label}
                    </button>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Close</span>
                  <Icon icon="heroicons:x-mark" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
