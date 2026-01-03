import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaUser,
  FaGoogle,
  FaMicrosoft,
  FaKey
} from 'react-icons/fa';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: 'employee' // employee or admin
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  // Demo credentials for testing
  const demoCredentials = {
    employee: { email: 'employee@dayflow.com', password: 'employee123' },
    admin: { email: 'admin@dayflow.com', password: 'admin123' }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) setLoginError('');
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  // Handle demo login
  const handleDemoLogin = (role) => {
    const credentials = demoCredentials[role];
    setFormData({
      ...formData,
      email: credentials.email,
      password: credentials.password,
      role
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication logic
      const isValidLogin = 
        (formData.role === 'employee' && 
         formData.email === demoCredentials.employee.email && 
         formData.password === demoCredentials.employee.password) ||
        (formData.role === 'admin' && 
         formData.email === demoCredentials.admin.email && 
         formData.password === demoCredentials.admin.password);

      if (!isValidLogin) {
        throw new Error('Invalid email or password');
      }

      // Save user data (in real app, this would be JWT token)
      const userData = {
        id: formData.role === 'admin' ? 'admin_001' : 'emp_001',
        email: formData.email,
        name: formData.role === 'admin' ? 'Admin User' : 'John Doe',
        role: formData.role,
        department: formData.role === 'admin' ? 'HR Department' : 'Engineering',
        avatar: `https://ui-avatars.com/api/?name=${formData.role === 'admin' ? 'Admin+User' : 'John+Doe'}&background=4f46e5&color=fff`,
        token: 'mock-jwt-token-' + Date.now()
      };

      // Store in localStorage
      if (formData.rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      // Redirect based on role
      if (formData.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }

    } catch (error) {
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = () => {
    setLoginError('Google login integration coming soon!');
  };

  const handleMicrosoftLogin = () => {
    setLoginError('Microsoft login integration coming soon!');
  };

  // Forgot password handler
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <FaKey className="text-indigo-600 text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your Dayflow HRMS account</p>
      </div>

      {/* Role Selection */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-3">Login As</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleDemoLogin('employee')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              formData.role === 'employee'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex flex-col items-center">
              <FaUser className="text-2xl mb-2" />
              <span className="font-medium">Employee</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              formData.role === 'admin'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex flex-col items-center">
              <FaUser className="text-2xl mb-2" />
              <span className="font-medium">Admin/HR</span>
            </div>
          </button>
        </div>
      </div>

      {/* Demo Credentials Banner */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FaKey className="text-blue-500 mt-0.5" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800 font-medium">Demo Credentials</p>
            <p className="text-sm text-blue-700 mt-1">
              {formData.role === 'admin' 
                ? `Email: ${demoCredentials.admin.email} | Password: ${demoCredentials.admin.password}`
                : `Email: ${demoCredentials.employee.email} | Password: ${demoCredentials.employee.password}`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaEnvelope className="mr-2" />
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="you@company.com"
              disabled={loading}
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-gray-700 font-medium">
              <FaLock className="mr-2" />
              Password
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              disabled={loading}
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Remember Me & Error Message */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              disabled={loading}
            />
            <span className="ml-2 text-gray-700">Remember me</span>
          </label>
        </div>

        {/* Login Error */}
        {loginError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{loginError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaGoogle className="text-red-500 mr-2" />
          <span className="text-gray-700 font-medium">Google</span>
        </button>
        <button
          type="button"
          onClick={handleMicrosoftLogin}
          disabled={loading}
          className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaMicrosoft className="text-blue-500 mr-2" />
          <span className="text-gray-700 font-medium">Microsoft</span>
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Create account
          </Link>
        </p>
      </div>

      {/* Terms and Privacy */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-800">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;