// services/employeeService.js

import api from './api';
import { authService } from './authService';

const employeeService = {
  // Get all employees with optional pagination and filters
  async getEmployees(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });

      const response = await api.get(`/employees?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw this.handleError(error);
    }
  },

  // Get single employee by ID
  async getEmployeeById(id) {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      throw this.handleError(error);
    }
  },

  // Create new employee
  async createEmployee(employeeData) {
    try {
      // If you have file uploads (like profile picture), you might need FormData
      let dataToSend = employeeData;
      let headers = {};

      // Check if we need to send FormData (for file uploads)
      if (employeeData.profilePicture instanceof File) {
        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
          if (key === 'profilePicture') {
            formData.append(key, employeeData[key]);
          } else {
            formData.append(key, employeeData[key]);
          }
        });
        dataToSend = formData;
        headers['Content-Type'] = 'multipart/form-data';
      }

      const response = await api.post('/employees', dataToSend, { headers });
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw this.handleError(error);
    }
  },

  // Update employee
  async updateEmployee(id, employeeData) {
    try {
      let dataToSend = employeeData;
      let headers = {};

      if (employeeData.profilePicture instanceof File) {
        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
          formData.append(key, employeeData[key]);
        });
        dataToSend = formData;
        headers['Content-Type'] = 'multipart/form-data';
      }

      const response = await api.put(`/employees/${id}`, dataToSend, { headers });
      return response.data;
    } catch (error) {
      console.error(`Error updating employee ${id}:`, error);
      throw this.handleError(error);
    }
  },

  // Delete employee
  async deleteEmployee(id) {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee ${id}:`, error);
      throw this.handleError(error);
    }
  },

  // Get employee statistics
  async getEmployeeStats() {
    try {
      const response = await api.get('/employees/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      throw this.handleError(error);
    }
  },

  // Search employees
  async searchEmployees(query, filters = {}) {
    try {
      const params = new URLSearchParams({
        query,
        ...filters,
      });

      const response = await api.get(`/employees/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching employees:', error);
      throw this.handleError(error);
    }
  },

  // Bulk import employees (from CSV/Excel)
  async bulkImportEmployees(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/employees/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error importing employees:', error);
      throw this.handleError(error);
    }
  },

  // Export employees to CSV/Excel
  async exportEmployees(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/employees/export?${params.toString()}`, {
        responseType: 'blob', // Important for file download
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      console.error('Error exporting employees:', error);
      throw this.handleError(error);
    }
  },

  // Get employees by department
  async getEmployeesByDepartment(departmentId) {
    try {
      const response = await api.get(`/employees/department/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employees for department ${departmentId}:`, error);
      throw this.handleError(error);
    }
  },

  // Update employee status (active, inactive, on leave, etc.)
  async updateEmployeeStatus(id, status) {
    try {
      const response = await api.patch(`/employees/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for employee ${id}:`, error);
      throw this.handleError(error);
    }
  },

  // Get employee attendance
  async getEmployeeAttendance(id, month, year) {
    try {
      const response = await api.get(`/employees/${id}/attendance`, {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance for employee ${id}:`, error);
      throw this.handleError(error);
    }
  },

  // Get employee leave balance
  async getEmployeeLeaveBalance(id) {
    try {
      const response = await api.get(`/employees/${id}/leave-balance`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leave balance for employee ${id}:`, error);
      throw this.handleError(error);
    }
  },

  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || `Server error: ${status}`;
      
      return {
        message,
        status,
        data: data || null,
        isNetworkError: false,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        data: null,
        isNetworkError: true,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 500,
        data: null,
        isNetworkError: false,
      };
    }
  },
};

export default employeeService;