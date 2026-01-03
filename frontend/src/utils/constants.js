// utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Employee Related Constants
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  TERMINATED: 'terminated',
  PROBATION: 'probation',
};

export const EMPLOYEE_STATUS_OPTIONS = [
  { value: EMPLOYEE_STATUS.ACTIVE, label: 'Active', color: 'success' },
  { value: EMPLOYEE_STATUS.INACTIVE, label: 'Inactive', color: 'default' },
  { value: EMPLOYEE_STATUS.ON_LEAVE, label: 'On Leave', color: 'warning' },
  { value: EMPLOYEE_STATUS.TERMINATED, label: 'Terminated', color: 'error' },
  { value: EMPLOYEE_STATUS.PROBATION, label: 'Probation', color: 'info' },
];

export const EMPLOYEE_DEPARTMENTS = {
  HR: 'Human Resources',
  IT: 'Information Technology',
  FINANCE: 'Finance',
  MARKETING: 'Marketing',
  SALES: 'Sales',
  OPERATIONS: 'Operations',
  CUSTOMER_SERVICE: 'Customer Service',
  PRODUCT: 'Product',
  ENGINEERING: 'Engineering',
  LEGAL: 'Legal',
};

export const DEPARTMENT_OPTIONS = Object.entries(EMPLOYEE_DEPARTMENTS).map(([key, value]) => ({
  value: key,
  label: value,
}));

export const EMPLOYEE_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  EMPLOYEE: 'employee',
  HR_STAFF: 'hr_staff',
  FINANCE_STAFF: 'finance_staff',
};

export const ROLE_OPTIONS = [
  { value: EMPLOYEE_ROLES.ADMIN, label: 'Administrator' },
  { value: EMPLOYEE_ROLES.MANAGER, label: 'Manager' },
  { value: EMPLOYEE_ROLES.SUPERVISOR, label: 'Supervisor' },
  { value: EMPLOYEE_ROLES.EMPLOYEE, label: 'Employee' },
  { value: EMPLOYEE_ROLES.HR_STAFF, label: 'HR Staff' },
  { value: EMPLOYEE_ROLES.FINANCE_STAFF, label: 'Finance Staff' },
];

export const EMPLOYEE_GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
};

export const GENDER_OPTIONS = [
  { value: EMPLOYEE_GENDER.MALE, label: 'Male' },
  { value: EMPLOYEE_GENDER.FEMALE, label: 'Female' },
  { value: EMPLOYEE_GENDER.OTHER, label: 'Other' },
  { value: EMPLOYEE_GENDER.PREFER_NOT_TO_SAY, label: 'Prefer not to say' },
];

export const EMPLOYMENT_TYPE = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERN: 'intern',
  FREELANCE: 'freelance',
};

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: EMPLOYMENT_TYPE.FULL_TIME, label: 'Full Time' },
  { value: EMPLOYMENT_TYPE.PART_TIME, label: 'Part Time' },
  { value: EMPLOYMENT_TYPE.CONTRACT, label: 'Contract' },
  { value: EMPLOYMENT_TYPE.INTERN, label: 'Intern' },
  { value: EMPLOYMENT_TYPE.FREELANCE, label: 'Freelance' },
];

// Leave Related Constants
export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  UNPAID: 'unpaid',
  COMPASSIONATE: 'compassionate',
  STUDY: 'study',
};

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const LEAVE_STATUS_OPTIONS = [
  { value: LEAVE_STATUS.PENDING, label: 'Pending', color: 'warning' },
  { value: LEAVE_STATUS.APPROVED, label: 'Approved', color: 'success' },
  { value: LEAVE_STATUS.REJECTED, label: 'Rejected', color: 'error' },
  { value: LEAVE_STATUS.CANCELLED, label: 'Cancelled', color: 'default' },
];

// Attendance Constants
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  ON_LEAVE: 'on_leave',
  HOLIDAY: 'holiday',
};

export const WORK_SHIFTS = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  NIGHT: 'night',
  FLEXIBLE: 'flexible',
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [5, 10, 20, 50, 100],
};

// Date & Time Constants
export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  DISPLAY_WITH_TIME: 'DD MMM YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
  MONTH_YEAR: 'MMMM YYYY',
  TIME_12H: 'hh:mm A',
  TIME_24H: 'HH:mm',
};

// File Constants
export const FILE_TYPES = {
  IMAGE: 'image/jpeg,image/png,image/gif',
  DOCUMENT: '.pdf,.doc,.docx,.xls,.xlsx',
  ALL: '*',
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  EMPLOYEE_ID_REGEX: /^[A-Z0-9]{3,10}$/,
};

// UI Constants
export const UI = {
  SNACKBAR_AUTO_HIDE_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  TOAST_POSITION: 'top-right',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hrms_auth_token',
  USER_DATA: 'hrms_user_data',
  THEME_PREFERENCE: 'hrms_theme',
  LANGUAGE_PREFERENCE: 'hrms_language',
  RECENT_SEARCHES: 'hrms_recent_searches',
};

// API Endpoints (for reference)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  EMPLOYEES: {
    BASE: '/employees',
    STATS: '/employees/stats',
    SEARCH: '/employees/search',
    IMPORT: '/employees/import',
    EXPORT: '/employees/export',
    BY_DEPARTMENT: '/employees/department',
  },
  DEPARTMENTS: '/departments',
  ATTENDANCE: '/attendance',
  LEAVE: '/leave',
  PAYROLL: '/payroll',
  REPORTS: '/reports',
  SETTINGS: '/settings',
};

// Export all constants
export default {
  API_CONFIG,
  EMPLOYEE_STATUS,
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_ROLES,
  LEAVE_TYPES,
  LEAVE_STATUS,
  ATTENDANCE_STATUS,
  PAGINATION,
  DATE_FORMATS,
  FILE_TYPES,
  VALIDATION,
  UI,
  STORAGE_KEYS,
  API_ENDPOINTS,
};