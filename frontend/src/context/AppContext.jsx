import React, { createContext, useState, useContext, useEffect } from 'react';

// Create App Context
const AppContext = createContext({});

// Custom hook to use app context
export const useApp = () => useContext(AppContext);

// App Provider Component
export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('hrms_theme');
    return savedTheme || 'light';
  });

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Loading state
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Alert/Toast state
  const [alerts, setAlerts] = useState([]);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Screen size detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Theme handling
  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('hrms_theme', theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Set theme directly
  const setThemeMode = (mode) => {
    if (['light', 'dark'].includes(mode)) {
      setTheme(mode);
    }
  };

  // Notifications management
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      title: notification.title || 'Notification',
      message: notification.message,
      type: notification.type || 'info', // info, success, warning, error
      read: false,
      timestamp: new Date().toISOString(),
      action: notification.action
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Auto-remove after 5 seconds for non-critical notifications
    if (notification.type !== 'error') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    // Recalculate unread count
    const unread = notifications.filter(n => !n.read && n.id !== id).length;
    setUnreadCount(unread);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Sidebar controls
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Loading controls
  const showLoading = (message = 'Loading...') => {
    setGlobalLoading(true);
    setLoadingMessage(message);
  };

  const hideLoading = () => {
    setGlobalLoading(false);
    setLoadingMessage('');
  };

  // Alert/Toast management
  const showAlert = (alert) => {
    const id = Date.now();
    const newAlert = {
      id,
      type: alert.type || 'info', // success, error, warning, info
      title: alert.title,
      message: alert.message,
      duration: alert.duration || 5000,
      position: alert.position || 'top-right'
    };

    setAlerts(prev => [...prev, newAlert]);

    // Auto remove after duration
    if (newAlert.duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, newAlert.duration);
    }

    return id;
  };

  const showSuccess = (message, title = 'Success') => {
    return showAlert({
      type: 'success',
      title,
      message
    });
  };

  const showError = (message, title = 'Error') => {
    return showAlert({
      type: 'error',
      title,
      message
    });
  };

  const showWarning = (message, title = 'Warning') => {
    return showAlert({
      type: 'warning',
      title,
      message
    });
  };

  const showInfo = (message, title = 'Info') => {
    return showAlert({
      type: 'info',
      title,
      message
    });
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  // User preferences
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('hrms_preferences');
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      pushNotifications: true,
      desktopNotifications: false,
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateFormat: 'MM/DD/YYYY',
      itemsPerPage: 10
    };
  });

  // Save preferences
  const updatePreference = (key, value) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('hrms_preferences', JSON.stringify(updated));
      return updated;
    });
  };

  // Session timeout
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [sessionWarning, setSessionWarning] = useState(false);

  useEffect(() => {
    const timeoutDuration = 30 * 60 * 1000; // 30 minutes
    
    const resetSessionTimer = () => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
      
      setSessionWarning(false);
      
      const timeoutId = setTimeout(() => {
        setSessionWarning(true);
        
        // Auto logout after warning period
        const logoutTimeout = setTimeout(() => {
          // Auto logout logic
          window.location.href = '/login?session=expired';
        }, 60000); // 1 minute warning period
        
        setSessionTimeout(logoutTimeout);
      }, timeoutDuration);
      
      setSessionTimeout(timeoutId);
    };

    // Event listeners for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetSessionTimer);
    });

    resetSessionTimer();

    return () => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetSessionTimer);
      });
    };
  }, []);

  // Reset session
  const resetSession = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionWarning(false);
      
      const timeoutDuration = 30 * 60 * 1000;
      const timeoutId = setTimeout(() => {
        setSessionWarning(true);
      }, timeoutDuration);
      
      setSessionTimeout(timeoutId);
    }
  };

  // Modal state management
  const [modals, setModals] = useState({});

  const openModal = (id, content) => {
    setModals(prev => ({
      ...prev,
      [id]: { isOpen: true, content }
    }));
  };

  const closeModal = (id) => {
    setModals(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
  };

  const closeAllModals = () => {
    setModals({});
  };

  // Context value
  const value = {
    // Theme
    theme,
    toggleTheme,
    setThemeMode,
    
    // Notifications
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    
    // Sidebar
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    closeSidebar,
    toggleSidebarCollapse,
    
    // Loading
    globalLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    
    // Alerts/Toasts
    alerts,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeAlert,
    clearAlerts,
    
    // User preferences
    preferences,
    updatePreference,
    
    // Device detection
    isMobile,
    
    // Session management
    sessionWarning,
    resetSession,
    
    // Modal management
    modals,
    openModal,
    closeModal,
    closeAllModals
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      
      {/* Global Loading Overlay */}
      {globalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-4"></div>
              <div>
                <p className="font-medium text-gray-800">{loadingMessage}</p>
                <p className="text-sm text-gray-500">Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Session Warning Modal */}
      {sessionWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-md">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Session About to Expire</h3>
                <p className="text-gray-600 mt-1">
                  Your session will expire in 1 minute due to inactivity.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Logout Now
              </button>
              <button
                onClick={resetSession}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Alerts/Toasts Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`rounded-lg shadow-lg p-4 transform transition-all duration-300 ${
              alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold">{alert.title}</h4>
                <p className="text-sm mt-1">{alert.message}</p>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export default AppContext;