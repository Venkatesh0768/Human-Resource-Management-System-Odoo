import React, { useState, useEffect } from 'react';
import {
  FaMoneyBillWave,
  FaDownload,
  FaPrint,
  FaFilter,
  FaSearch,
  FaEye,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaChartBar,
  FaFileExport,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

const PayrollAdmin = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    month: 'all',
    department: 'all'
  });

  // Mock data
  const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'];
  const months = [
    'January 2024', 'February 2024', 'March 2024', 'April 2024', 
    'May 2024', 'June 2024', 'July 2024', 'August 2024',
    'September 2024', 'October 2024', 'November 2024', 'December 2024'
  ];

  // Initialize data
  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        employeeId: `EMP${(i + 1001).toString().padStart(4, '0')}`,
        employeeName: `Employee ${i + 1}`,
        department: departments[i % departments.length],
        basicSalary: 50000 + (i * 1000),
        allowances: 10000 + (i * 500),
        deductions: 5000 + (i * 200),
        overtime: i * 100,
        bonus: i % 3 === 0 ? 5000 : 0,
        tax: (50000 + (i * 1000)) * 0.1,
        netSalary: 0, // Will be calculated
        month: months[i % 12],
        status: i % 4 === 0 ? 'pending' : i % 4 === 1 ? 'processing' : i % 4 === 2 ? 'completed' : 'failed',
        paymentDate: i % 3 === 0 ? '2024-01-15' : '2024-01-20',
        paymentMethod: i % 2 === 0 ? 'Bank Transfer' : 'Check',
        processedBy: i % 3 === 0 ? 'Admin 1' : 'Admin 2',
        processedAt: '2024-01-10 10:30:00'
      }));

      // Calculate net salary
      mockData.forEach(payroll => {
        payroll.netSalary = payroll.basicSalary + payroll.allowances + payroll.overtime + payroll.bonus - payroll.deductions - payroll.tax;
      });

      setPayrolls(mockData);
      setFilteredPayrolls(mockData);
      setLoading(false);
    }, 1000);
  };

  // Filter payrolls
  useEffect(() => {
    let filtered = [...payrolls];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.employeeName.toLowerCase().includes(term) ||
        p.employeeId.toLowerCase().includes(term) ||
        p.department.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Month filter
    if (filters.month !== 'all') {
      filtered = filtered.filter(p => p.month === filters.month);
    }

    // Department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(p => p.department === filters.department);
    }

    setFilteredPayrolls(filtered);
  }, [searchTerm, filters, payrolls]);

  // Table columns
  const columns = [
    {
      key: 'employee',
      title: 'Employee',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
            <FaUser className="text-indigo-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.employeeName}</div>
            <div className="text-sm text-gray-500">{row.employeeId}</div>
          </div>
        </div>
      )
    },
    {
      key: 'department',
      title: 'Department',
      sortable: true,
      render: (value) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {value}
        </span>
      )
    },
    {
      key: 'month',
      title: 'Month',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FaCalendarAlt className="text-gray-400 mr-2" />
          {value}
        </div>
      )
    },
    {
      key: 'netSalary',
      title: 'Net Salary',
      sortable: true,
      render: (value) => (
        <div className="font-bold text-gray-900">
          ${value.toLocaleString()}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          pending: { color: 'yellow', icon: <FaClock />, text: 'Pending' },
          processing: { color: 'blue', icon: <FaClock />, text: 'Processing' },
          completed: { color: 'green', icon: <FaCheckCircle />, text: 'Completed' },
          failed: { color: 'red', icon: <FaTimesCircle />, text: 'Failed' }
        };
        const config = statusConfig[value] || { color: 'gray', icon: null, text: value };
        
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800`}>
            {config.icon && <span className="mr-2">{config.icon}</span>}
            {config.text}
          </span>
        );
      }
    },
    {
      key: 'paymentDate',
      title: 'Payment Date',
      sortable: true
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => viewPayrollDetails(row)}
            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg"
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            onClick={() => editPayroll(row)}
            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg"
            title="Edit Payroll"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => deletePayroll(row)}
            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
            title="Delete Payroll"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  // View payroll details
  const viewPayrollDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setShowPayrollModal(true);
  };

  // Edit payroll
  const editPayroll = (payroll) => {
    setSelectedPayroll(payroll);
    // Navigate to edit page or show edit modal
    alert(`Editing payroll for ${payroll.employeeName}`);
  };

  // Delete payroll
  const deletePayroll = (payroll) => {
    setSelectedPayroll(payroll);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedPayroll) {
      setPayrolls(prev => prev.filter(p => p.id !== selectedPayroll.id));
      setShowDeleteModal(false);
      setSelectedPayroll(null);
    }
  };

  // Generate new payroll
  const generatePayroll = () => {
    setShowGenerateModal(true);
  };

  // Process payroll
  const processPayroll = () => {
    alert('Processing payroll...');
    // Add processing logic
  };

  // Export payroll
  const exportPayroll = (format) => {
    alert(`Exporting payroll as ${format}...`);
    // Add export logic
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalPayroll = filteredPayrolls.reduce((sum, p) => sum + p.netSalary, 0);
    const avgSalary = filteredPayrolls.length > 0 ? totalPayroll / filteredPayrolls.length : 0;
    const pendingCount = filteredPayrolls.filter(p => p.status === 'pending').length;
    const completedCount = filteredPayrolls.filter(p => p.status === 'completed').length;

    return {
      totalPayroll,
      avgSalary,
      pendingCount,
      completedCount,
      totalEmployees: filteredPayrolls.length
    };
  };

  const stats = calculateStats();

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: 'all',
      month: 'all',
      department: 'all'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Payroll Management</h1>
            <p className="text-gray-600 mt-2">
              Manage employee salaries, bonuses, deductions, and payments
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={generatePayroll}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center"
            >
              <FaPlus className="mr-2" />
              Generate Payroll
            </button>
            <button
              onClick={() => exportPayroll('excel')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center"
            >
              <FaFileExport className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-800">
                ${(stats.totalPayroll / 1000).toFixed(1)}k
              </div>
              <div className="text-sm text-gray-600">Total Payroll</div>
            </div>
            <FaMoneyBillWave className="text-green-500 text-2xl" />
          </div>
          <div className="mt-3 text-sm text-green-600">
            +2.5% from last month
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-800">
                ${stats.avgSalary.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Average Salary</div>
            </div>
            <FaChartBar className="text-blue-500 text-2xl" />
          </div>
          <div className="mt-3 text-sm text-blue-600">
            Based on {stats.totalEmployees} employees
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.pendingCount}
              </div>
              <div className="text-sm text-gray-600">Pending Payments</div>
            </div>
            <FaClock className="text-yellow-500 text-2xl" />
          </div>
          <div className="mt-3 text-sm text-yellow-600">
            Need attention
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.completedCount}
              </div>
              <div className="text-sm text-gray-600">Completed Payments</div>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
          <div className="mt-3 text-sm text-green-600">
            98% success rate
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Payroll Records</h3>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={processPayroll}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center"
            >
              <FaCheckCircle className="mr-2" />
              Process Payroll
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Employee
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={filters.month}
              onChange={(e) => setFilters({...filters, month: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="all">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading payroll data..." />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredPayrolls}
            title=""
            searchable={false}
            pagination
            pageSizeOptions={[10, 25, 50]}
            defaultPageSize={10}
            onRowClick={viewPayrollDetails}
          />
        )}
      </div>

      {/* Payroll Details Modal */}
      <Modal
        isOpen={showPayrollModal}
        onClose={() => {
          setShowPayrollModal(false);
          setSelectedPayroll(null);
        }}
        title="Payroll Details"
        size="lg"
      >
        {selectedPayroll && (
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <FaUser className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{selectedPayroll.employeeName}</h4>
                  <p className="text-gray-600">
                    {selectedPayroll.employeeId} • {selectedPayroll.department}
                  </p>
                </div>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Salary Breakdown</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Basic Salary</p>
                  <p className="text-lg font-bold text-gray-800">
                    ${selectedPayroll.basicSalary.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Allowances</p>
                  <p className="text-lg font-bold text-gray-800">
                    ${selectedPayroll.allowances.toLocaleString()}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Overtime</p>
                  <p className="text-lg font-bold text-gray-800">
                    ${selectedPayroll.overtime.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Bonus</p>
                  <p className="text-lg font-bold text-gray-800">
                    ${selectedPayroll.bonus.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Deductions</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="text-lg font-bold text-red-700">
                    -${selectedPayroll.tax.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Other Deductions</p>
                  <p className="text-lg font-bold text-orange-700">
                    -${selectedPayroll.deductions.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Net Salary</p>
                  <p className="text-3xl font-bold text-green-800">
                    ${selectedPayroll.netSalary.toLocaleString()}
                  </p>
                </div>
                <FaMoneyBillWave className="text-green-600 text-4xl" />
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Payment Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Month</p>
                  <p className="font-medium">{selectedPayroll.month}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Date</p>
                  <p className="font-medium">{selectedPayroll.paymentDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{selectedPayroll.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Processed By</p>
                  <p className="font-medium">{selectedPayroll.processedBy}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                <FaDownload className="inline mr-2" />
                Download Payslip
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                <FaPrint className="inline mr-2" />
                Print Payslip
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Generate Payroll Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate Payroll"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Month
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Department
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This will generate payroll for all active employees in the selected department for the chosen month.
              The system will automatically calculate salaries based on attendance, leaves, and other factors.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowGenerateModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert('Payroll generation started!');
                setShowGenerateModal(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Generate Payroll
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Payroll Record"
        type="error"
        showFooter
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
        cancelText="Cancel"
      >
        <div className="py-4">
          <div className="flex items-start mb-4">
            <FaTimesCircle className="text-red-500 text-2xl mr-3 mt-1" />
            <div>
              <p className="font-medium text-gray-800 mb-2">
                Are you sure you want to delete this payroll record?
              </p>
              <p className="text-gray-600">
                This action will permanently delete the payroll record for{' '}
                <strong>{selectedPayroll?.employeeName}</strong> ({selectedPayroll?.month}).
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PayrollAdmin;