import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create Auth Context
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for saved user on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem('hrms_user');
        const savedToken = localStorage.getItem('hrms_token');
        
        if (savedUser && savedToken) {
          // Validate token (in real app, verify with backend)
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('hrms_user');
        localStorage.removeItem('hrms_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password, role = 'employee') => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication - In production, this would be an API call
      const mockUsers = {
        employee: {
          id: 'emp_001',
          name: 'John Doe',
          email: 'employee@dayflow.com',
          role: 'employee',
          employeeId: 'EMP00123',
          department: 'Engineering',
          position: 'Software Engineer',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4f46e5&color=fff',
          joinDate: '2022-03-15'
        },
        admin: {
          id: 'admin_001',
          name: 'Admin User',
          email: 'admin@dayflow.com',
          role: 'admin',
          employeeId: 'ADM001',
          department: 'Human Resources',
          position: 'HR Manager',
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=dc2626&color=fff',
          joinDate: '2020-01-10'
        }
      };

      // Check credentials (mock validation)
      const isValidLogin = 
        (role === 'employee' && email === 'employee@dayflow.com' && password === 'employee123') ||
        (role === 'admin' && email === 'admin@dayflow.com' && password === 'admin123');

      if (!isValidLogin) {
        throw new Error('Invalid email or password');
      }

      const userData = mockUsers[role];
      const token = `mock-jwt-token-${Date.now()}`;

      // Save to localStorage
      localStorage.setItem('hrms_user', JSON.stringify(userData));
      localStorage.setItem('hrms_token', token);

      // Update state
      setUser(userData);

      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }

      return { success: true, user: userData };
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }

      // Check if email already exists (mock)
      const existingUsers = JSON.parse(localStorage.getItem('hrms_pending_users') || '[]');
      const emailExists = existingUsers.some(user => user.email === userData.email);
      
      if (emailExists) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: `pending_${Date.now()}`,
        ...userData,
        status: 'pending', // Pending admin approval
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=4f46e5&color=fff`
      };

      // Save to pending users
      existingUsers.push(newUser);
      localStorage.setItem('hrms_pending_users', JSON.stringify(existingUsers));

      return { 
        success: true, 
        message: 'Account created successfully! Waiting for admin approval.',
        user: newUser 
      };
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('hrms_user');
    localStorage.removeItem('hrms_token');
    
    // Clear state
    setUser(null);
    setError(null);
    
    // Navigate to login
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user data
      const updatedUser = { ...user, ...updatedData };
      
      // Save to localStorage
      localStorage.setItem('hrms_user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message || 'Profile update failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // In real app, verify current password with backend
      return { success: true, message: 'Password changed successfully' };
    } catch (err) {
      setError(err.message || 'Password change failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password request
  const requestPasswordReset = async (email) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (!email) {
        throw new Error('Email is required');
      }

      return { 
        success: true, 
        message: 'Password reset instructions sent to your email' 
      };
    } catch (err) {
      setError(err.message || 'Password reset request failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  // Get user permissions (mock)
  const getUserPermissions = () => {
    if (!user) return [];
    
    const permissions = {
      employee: ['view_profile', 'view_attendance', 'apply_leave', 'view_payroll'],
      admin: [
        'view_profile', 'edit_profile', 
        'view_all_employees', 'edit_employees',
        'view_all_attendance', 'approve_attendance',
        'view_all_leaves', 'approve_leaves',
        'manage_payroll', 'generate_reports',
        'manage_departments', 'manage_positions'
      ]
    };

    return permissions[user.role] || [];
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    isAuthenticated,
    hasRole,
    getUserPermissions,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;