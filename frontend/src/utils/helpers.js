// utils/helper.js

import {
  EMPLOYEE_STATUS,
  EMPLOYEE_DEPARTMENTS,
  EMPLOYMENT_TYPE,
  LEAVE_STATUS,
  DATE_FORMATS,
} from './constants';

// Format date using dayjs or date-fns (using dayjs example)
// Install: npm install dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

/**
 * Format a date string to human readable format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (defaults to DISPLAY format)
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return 'N/A';
  return dayjs(date).format(format);
};

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  return dayjs(date).fromNow();
};

/**
 * Get employee status badge color based on status
 * @param {string} status - Employee status
 * @returns {string} Color for badge
 */
export const getStatusColor = (status) => {
  const colors = {
    [EMPLOYEE_STATUS.ACTIVE]: 'success',
    [EMPLOYEE_STATUS.INACTIVE]: 'default',
    [EMPLOYEE_STATUS.ON_LEAVE]: 'warning',
    [EMPLOYEE_STATUS.TERMINATED]: 'error',
    [EMPLOYEE_STATUS.PROBATION]: 'info',
  };
  return colors[status] || 'default';
};

/**
 * Get department name from department code
 * @param {string} departmentCode - Department code
 * @returns {string} Department name
 */
export const getDepartmentName = (departmentCode) => {
  return EMPLOYEE_DEPARTMENTS[departmentCode] || departmentCode;
};

/**
 * Get employment type label
 * @param {string} type - Employment type code
 * @returns {string} Employment type label
 */
export const getEmploymentTypeLabel = (type) => {
  const labels = {
    [EMPLOYMENT_TYPE.FULL_TIME]: 'Full Time',
    [EMPLOYMENT_TYPE.PART_TIME]: 'Part Time',
    [EMPLOYMENT_TYPE.CONTRACT]: 'Contract',
    [EMPLOYMENT_TYPE.INTERN]: 'Intern',
    [EMPLOYMENT_TYPE.FREELANCE]: 'Freelance',
  };
  return labels[type] || type;
};

/**
 * Get leave status color
 * @param {string} status - Leave status
 * @returns {string} Color for badge
 */
export const getLeaveStatusColor = (status) => {
  const colors = {
    [LEAVE_STATUS.PENDING]: 'warning',
    [LEAVE_STATUS.APPROVED]: 'success',
    [LEAVE_STATUS.REJECTED]: 'error',
    [LEAVE_STATUS.CANCELLED]: 'default',
  };
  return colors[status] || 'default';
};

/**
 * Format currency (INR, USD, etc.)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {string} locale - Locale string
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  if (amount === null || amount === undefined) return 'N/A';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currency} ${amount}`;
  }
};

/**
 * Format phone number
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length > 10) {
    const countryCode = cleaned.slice(0, cleaned.length - 10);
    const number = cleaned.slice(-10);
    return `+${countryCode} (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
  }
  
  return phone;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Generate a random employee ID
 * @param {string} prefix - ID prefix (default: EMP)
 * @returns {string} Generated employee ID
 */
export const generateEmployeeId = (prefix = 'EMP') => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${timestamp}${randomNum}`;
};

/**
 * Calculate age from date of birth
 * @param {string|Date} dob - Date of birth
 * @returns {number} Age in years
 */
export const calculateAge = (dob) => {
  if (!dob) return null;
  
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Download a file from blob
 * @param {Blob} blob - File blob
 * @param {string} filename - Name for downloaded file
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Convert object to query string
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export const objectToQueryString = (params) => {
  if (!params) return '';
  
  const filteredParams = Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '')
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});
  
  return new URLSearchParams(filteredParams).toString();
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone an object (simple implementation)
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Calculate pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const calculatePagination = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    offset: (page - 1) * limit,
  };
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Check if user has required role/permission
 * @param {Array} userRoles - User's roles
 * @param {string|Array} requiredRole - Required role(s)
 * @returns {boolean} True if user has required role
 */
export const hasPermission = (userRoles, requiredRole) => {
  if (!userRoles || !requiredRole) return false;
  
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return userRoles.some(role => requiredRoles.includes(role));
};

export default {
  formatDate,
  formatRelativeTime,
  getStatusColor,
  getDepartmentName,
  getEmploymentTypeLabel,
  getLeaveStatusColor,
  formatCurrency,
  formatPhoneNumber,
  truncateText,
  generateEmployeeId,
  calculateAge,
  isValidEmail,
  isValidPhone,
  capitalizeWords,
  downloadFile,
  objectToQueryString,
  debounce,
  deepClone,
  calculatePagination,
  getInitials,
  hasPermission,
};