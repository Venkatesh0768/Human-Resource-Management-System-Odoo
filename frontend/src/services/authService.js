// authService.js

// Base URL for your backend API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Key for storing token in localStorage
const TOKEN_KEY = 'hrms_auth_token';

// Simulate a delay for async operations (optional)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const authService = {
  // Login method
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem('hrms_user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register method
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout method
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('hrms_user');
    // Optionally redirect to login page
    window.location.href = '/login';
  },

  // Get current token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get current user info
  getCurrentUser() {
    const userStr = localStorage.getItem('hrms_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    // You could also validate token expiry here
    return !!token;
  },

  // Reset password request
  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userData) {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Profile update failed');
      }

      const data = await response.json();
      
      // Update stored user data if needed
      if (data.user) {
        localStorage.setItem('hrms_user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },
};

export default authService;