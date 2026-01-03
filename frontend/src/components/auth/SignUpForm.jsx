import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaIdCard,
  FaBuilding,
  FaPhone,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft
} from 'react-icons/fa';

const SignupForm = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    dateOfBirth: '',
    
    // Step 2: Account Details
    password: '',
    confirmPassword: '',
    role: 'employee',
    department: '',
    
    // Step 3: Additional Info
    jobTitle: '',
    hireDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Terms
    agreeToTerms: false,
    subscribeToUpdates: true
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [departments, setDepartments] = useState([]);

  // Departments data
  useEffect(() => {
    // Fetch departments from API in real application
    const mockDepartments = [
      'Engineering',
      'Human Resources',
      'Sales',
      'Marketing',
      'Finance',
      'Operations',
      'Customer Support',
      'Research & Development',
      'IT',
      'Administration'
    ];
    setDepartments(mockDepartments);
  }, []);

  // Password strength checker
  useEffect(() => {
    const calculateStrength = (password) => {
      let strength = 0;
      
      // Length check
      if (password.length >= 8) strength += 20;
      if (password.length >= 12) strength += 10;
      
      // Character variety checks
      if (/[A-Z]/.test(password)) strength += 20; // Uppercase
      if (/[a-z]/.test(password)) strength += 20; // Lowercase
      if (/[0-9]/.test(password)) strength += 20; // Numbers
      if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Special chars
      
      return Math.min(strength, 100);
    };

    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  // Password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 80) return 'bg-green-500';
    if (passwordStrength >= 60) return 'bg-yellow-500';
    if (passwordStrength >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 80) return 'Strong';
    if (passwordStrength >= 60) return 'Good';
    if (passwordStrength >= 40) return 'Fair';
    return 'Weak';
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
  };

  // Validation for each step
  const validateStep = (step) => {
    const newErrors = {};

    switch(step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        break;

      case 2:
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (passwordStrength < 40) {
          newErrors.password = 'Password is too weak';
        }
        
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (!formData.department) newErrors.department = 'Department is required';
        break;

      case 3:
        if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
        if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
        break;
    }

    return newErrors;
  };

  // Navigation between steps
  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalErrors = validateStep(currentStep);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create user object
      const userData = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        employeeId: formData.employeeId,
        dateOfBirth: formData.dateOfBirth,
        role: formData.role,
        department: formData.department,
        jobTitle: formData.jobTitle,
        hireDate: formData.hireDate,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=4f46e5&color=fff`,
        status: 'pending', // Pending admin approval
        createdAt: new Date().toISOString()
      };

      // Store in localStorage (for demo)
      localStorage.setItem('pendingUser', JSON.stringify(userData));

      // Show success message
      alert('Account created successfully! Waiting for admin approval.');
      
      // Redirect to login
      navigate('/login', { 
        state: { 
          message: 'Account created! Please wait for admin approval.',
          email: formData.email 
        } 
      });

    } catch (error) {
      alert('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render step indicators
  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Personal Info' },
      { number: 2, label: 'Account Setup' },
      { number: 3, label: 'Job Details' }
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                  currentStep === step.number
                    ? 'bg-indigo-600 text-white'
                    : currentStep > step.number
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <FaCheckCircle />
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  currentStep === step.number
                    ? 'text-indigo-600'
                    : currentStep > step.number
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  currentStep > step.number ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-full transition-all duration-300 ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    style={{ width: currentStep > step.number ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Render step 1: Personal Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Personal Information</h3>
      <p className="text-gray-600 mb-6">Please provide your basic personal details.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaUser className="mr-2" />
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaUser className="mr-2" />
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center text-gray-700 font-medium mb-2">
          <FaEnvelope className="mr-2" />
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="john.doe@company.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaIdCard className="mr-2" />
            Employee ID *
          </label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
              errors.employeeId ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="EMP001"
          />
          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
          )}
        </div>

        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaCalendarAlt className="mr-2" />
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
              errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center text-gray-700 font-medium mb-2">
          <FaPhone className="mr-2" />
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          placeholder="+1 (555) 123-4567"
        />
      </div>
    </div>
  );

  // Render step 2: Account Setup
  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Account Setup</h3>
      <p className="text-gray-600 mb-6">Create your secure login credentials.</p>

      <div>
        <label className="flex items-center text-gray-700 font-medium mb-2">
          <FaLock className="mr-2" />
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        {/* Password strength indicator */}
        {formData.password && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Password strength:</span>
              <span className={`font-medium ${
                passwordStrength >= 80 ? 'text-green-600' :
                passwordStrength >= 60 ? 'text-yellow-600' :
                passwordStrength >= 40 ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {getPasswordStrengthText()}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                style={{ width: `${passwordStrength}%` }}
              ></div>
            </div>
            
            {/* Password requirements */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center text-sm">
                {formData.password.length >= 8 ? (
                  <FaCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FaTimesCircle className="text-gray-300 mr-2" />
                )}
                <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center text-sm">
                {/[A-Z]/.test(formData.password) ? (
                  <FaCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FaTimesCircle className="text-gray-300 mr-2" />
                )}
                <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                  One uppercase letter
                </span>
              </div>
              <div className="flex items-center text-sm">
                {/[0-9]/.test(formData.password) ? (
                  <FaCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FaTimesCircle className="text-gray-300 mr-2" />
                )}
                <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                  One number
                </span>
              </div>
              <div className="flex items-center text-sm">
                {/[^A-Za-z0-9]/.test(formData.password) ? (
                  <FaCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FaTimesCircle className="text-gray-300 mr-2" />
                )}
                <span className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                  One special character
                </span>
              </div>
            </div>
          </div>
        )}
        
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="flex items-center text-gray-700 font-medium mb-2">
          <FaLock className="mr-2" />
          Confirm Password *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaBuilding className="mr-2" />
            Department *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
              errors.department ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department}</p>
          )}
        </div>

        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`relative cursor-pointer ${
              formData.role === 'employee' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
            }`}>
              <input
                type="radio"
                name="role"
                value="employee"
                checked={formData.role === 'employee'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`p-4 rounded-lg border text-center transition ${
                formData.role === 'employee'
                  ? 'bg-indigo-50 border-indigo-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <span className="font-medium">Employee</span>
              </div>
            </label>
            <label className={`relative cursor-pointer ${
              formData.role === 'admin' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
            }`}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`p-4 rounded-lg border text-center transition ${
                formData.role === 'admin'
                  ? 'bg-indigo-50 border-indigo-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <span className="font-medium">Admin/HR</span>
              </div>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Note: Admin accounts require additional approval
          </p>
        </div>
      </div>
    </div>
  );

  // Render step 3: Job Details
  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Job Information</h3>
      <p className="text-gray-600 mb-6">Provide your employment details.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            Job Title *
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
              errors.jobTitle ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Software Engineer"
          />
          {errors.jobTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
          )}
        </div>

        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaCalendarAlt className="mr-2" />
            Hire Date *
          </label>
          <input
            type="date"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
              errors.hireDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.hireDate && (
            <p className="mt-1 text-sm text-red-600">{errors.hireDate}</p>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center text-gray-700 font-medium mb-2">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          placeholder="123 Main St, City, State, ZIP"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="Emergency contact person"
          />
        </div>

        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaPhone className="mr-2" />
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="+1 (555) 987-6543"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
          />
          <span className="ml-3 text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Privacy Policy
            </a>
            {' '}*
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
        )}

        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            name="subscribeToUpdates"
            checked={formData.subscribeToUpdates}
            onChange={handleChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
          />
          <span className="ml-3 text-gray-700">
            I want to receive updates about Dayflow HRMS features, announcements, and promotions
          </span>
        </label>
      </div>
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <FaUser className="text-indigo-600 text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
        <p className="text-gray-600 mt-2">Join Dayflow HRMS in just a few steps</p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
              currentStep === 1
                ? 'invisible'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center"
            >
              Continue
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Complete Registration
                  <FaCheckCircle className="ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Login Link */}
      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800 font-medium">Your information is secure</p>
            <p className="text-sm text-blue-700 mt-1">
              We use industry-standard encryption to protect your data. Your password is never stored in plain text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;