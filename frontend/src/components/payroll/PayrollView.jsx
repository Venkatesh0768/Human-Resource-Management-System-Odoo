import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaMoneyBillWave,
  FaDownload,
  FaPrint,
  FaCalendarAlt,
  FaFilePdf,
  FaFileExcel,
  FaEye,
  FaQuestionCircle,
  FaChartLine,
  FaHistory,
  FaFileInvoiceDollar,
  FaPercentage,
  FaCreditCard,
  FaBuilding,
  FaUserTie
} from 'react-icons/fa';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

const PayrollView = () => {
  const { user } = useAuth();
  const [payrollData, setPayrollData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPaySlipModal, setShowPaySlipModal] = useState(false);
  const [selectedPaySlip, setSelectedPaySlip] = useState(null);
  const [months, setMonths] = useState([]);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  // Initialize data
  useEffect(() => {
    fetchPayrollData();
    generateMonthList();
  }, [yearFilter]);

  const generateMonthList = () => {
    const monthsList = [];
    const currentYear = yearFilter;
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      monthsList.push({
        value: monthName,
        label: monthName,
        id: i + 1
      });
    }
    
    setMonths(monthsList);
    // Set default to current month
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    setSelectedMonth(currentMonth);
  };

  const fetchPayrollData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data for employee
      const mockData = {
        employeeId: user?.employeeId || 'EMP00123',
        employeeName: user?.name || 'John Doe',
        department: user?.department || 'Engineering',
        position: user?.position || 'Software Engineer',
        joinDate: '2022-03-15',
        
        // Current month salary
        currentMonth: {
          month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          basicSalary: 75000,
          houseRentAllowance: 15000,
          medicalAllowance: 5000,
          conveyanceAllowance: 3000,
          specialAllowance: 7000,
          overtime: 4500,
          bonus: 10000,
          
          deductions: {
            providentFund: 3000,
            professionalTax: 200,
            incomeTax: 7500,
            loanDeduction: 2000,
            otherDeductions: 500
          },
          
          netSalary: 0, // Will calculate
          paymentDate: '2024-01-28',
          paymentMethod: 'Bank Transfer',
          accountNumber: 'XXXX-XXXX-1234',
          bankName: 'City Bank',
          status: 'paid'
        },
        
        // Salary history
        salaryHistory: [
          {
            id: 1,
            month: 'December 2023',
            grossSalary: 105500,
            deductions: 13200,
            netSalary: 92300,
            status: 'paid',
            paymentDate: '2023-12-28'
          },
          {
            id: 2,
            month: 'November 2023',
            grossSalary: 105500,
            deductions: 13200,
            netSalary: 92300,
            status: 'paid',
            paymentDate: '2023-11-28'
          },
          {
            id: 3,
            month: 'October 2023',
            grossSalary: 105500,
            deductions: 13200,
            netSalary: 92300,
            status: 'paid',
            paymentDate: '2023-10-28'
          },
          {
            id: 4,
            month: 'September 2023',
            grossSalary: 100500,
            deductions: 12200,
            netSalary: 88300,
            status: 'paid',
            paymentDate: '2023-09-28'
          }
        ],
        
        // Yearly summary
        yearlySummary: {
          totalEarnings: 1266000,
          totalDeductions: 158400,
          netPaid: 1107600,
          averageMonthly: 92300,
          taxPaid: 90000
        },
        
        // Tax information
        taxInfo: {
          panNumber: 'ABCDE1234F',
          taxSlab: '30%',
          financialYear: '2023-2024',
          totalTaxableIncome: 1050000,
          taxPaid: 90000,
          taxDue: 0
        },
        
        // Benefits
        benefits: [
          { name: 'Health Insurance', value: 'Full Coverage', provider: 'HealthCare Inc.' },
          { name: 'Provident Fund', value: '12% Contribution', balance: '₹2,45,000' },
          { name: 'Gratuity', value: 'Accrued', amount: '₹85,000' },
          { name: 'Bonus', value: 'Annual Performance', lastAmount: '₹1,00,000' }
        ]
      };

      // Calculate net salary
      const current = mockData.currentMonth;
      const gross = current.basicSalary + current.houseRentAllowance + current.medicalAllowance + 
                   current.conveyanceAllowance + current.specialAllowance + current.overtime + current.bonus;
      const totalDeductions = current.deductions.providentFund + current.deductions.professionalTax + 
                             current.deductions.incomeTax + current.deductions.loanDeduction + 
                             current.deductions.otherDeductions;
      mockData.currentMonth.grossSalary = gross;
      mockData.currentMonth.totalDeductions = totalDeductions;
      mockData.currentMonth.netSalary = gross - totalDeductions;

      setPayrollData(mockData);
      setLoading(false);
    }, 1000);
  };

  // View pay slip
  const viewPaySlip = (monthData) => {
    setSelectedPaySlip(monthData);
    setShowPaySlipModal(true);
  };

  // Download pay slip
  const downloadPaySlip = (format) => {
    const month = selectedMonth || payrollData?.currentMonth.month;
    alert(`Downloading ${month} payslip as ${format.toUpperCase()}...`);
    // Implement actual download logic
  };

  // Print pay slip
  const printPaySlip = () => {
    const month = selectedMonth || payrollData?.currentMonth.month;
    alert(`Printing ${month} payslip...`);
    // Implement actual print logic
  };

  // Get selected month data
  const getSelectedMonthData = () => {
    if (selectedMonth === payrollData?.currentMonth.month) {
      return payrollData.currentMonth;
    }
    
    // Find in history
    return payrollData?.salaryHistory.find(item => item.month === selectedMonth) || null;
  };

  const selectedMonthData = getSelectedMonthData();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner 
          size="lg"
          type="ring"
          text="Loading your payroll information..."
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Payroll</h1>
            <p className="text-gray-600 mt-2">
              View your salary details, payslips, and financial information
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => downloadPaySlip('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center"
            >
              <FaFilePdf className="mr-2" />
              Download PDF
            </button>
            <button
              onClick={printPaySlip}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center"
            >
              <FaPrint className="mr-2" />
              Print Payslip
            </button>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Pay Period</h3>
            <p className="text-gray-600">Choose a month to view detailed salary breakdown</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {[2022, 2023, 2024].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-w-[200px]"
            >
              {months.map(month => (
                <option key={month.id} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <FaUserTie className="text-indigo-600 text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{payrollData?.employeeName}</h3>
              <p className="text-gray-600">{payrollData?.position}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Employee ID</span>
              <span className="font-medium">{payrollData?.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Department</span>
              <span className="font-medium">{payrollData?.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Joining Date</span>
              <span className="font-medium">{payrollData?.joinDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bank Account</span>
              <span className="font-medium">{payrollData?.currentMonth.accountNumber}</span>
            </div>
          </div>
        </div>

        {/* Current Month Summary */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow p-6 text-white lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">{selectedMonthData?.month || payrollData?.currentMonth.month}</h3>
              <p className="text-indigo-100">Net Salary for Selected Month</p>
            </div>
            <FaMoneyBillWave className="text-3xl opacity-80" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-indigo-200">Gross Salary</p>
              <p className="text-2xl font-bold">
                ${selectedMonthData?.grossSalary?.toLocaleString() || payrollData?.currentMonth.grossSalary.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-indigo-200">Deductions</p>
              <p className="text-2xl font-bold text-red-200">
                -${selectedMonthData?.deductions?.toLocaleString() || payrollData?.currentMonth.totalDeductions.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-indigo-200">Net Salary</p>
              <p className="text-3xl font-bold">
                ${selectedMonthData?.netSalary?.toLocaleString() || payrollData?.currentMonth.netSalary.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-indigo-200">Status</p>
              <div className="flex items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <span className="font-bold">{selectedMonthData?.status || payrollData?.currentMonth.status}</span>
              </div>
              <p className="text-sm mt-1">
                Paid on {selectedMonthData?.paymentDate || payrollData?.currentMonth.paymentDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Earnings */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Earnings</h3>
            <FaChartLine className="text-green-500" />
          </div>
          
          <div className="space-y-4">
            {selectedMonthData === payrollData?.currentMonth ? (
              <>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Basic Salary</p>
                    <p className="text-sm text-gray-600">Fixed monthly salary</p>
                  </div>
                  <p className="text-lg font-bold text-green-700">
                    ${payrollData.currentMonth.basicSalary.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">House Rent Allowance</p>
                    <p className="text-sm text-gray-600">HRA component</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    ${payrollData.currentMonth.houseRentAllowance.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Medical Allowance</p>
                    <p className="text-sm text-gray-600">Medical expenses</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    ${payrollData.currentMonth.medicalAllowance.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Special Allowance</p>
                    <p className="text-sm text-gray-600">Additional compensation</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    ${payrollData.currentMonth.specialAllowance.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Overtime</p>
                    <p className="text-sm text-gray-600">Extra hours worked</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    +${payrollData.currentMonth.overtime.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Bonus</p>
                    <p className="text-sm text-gray-600">Performance bonus</p>
                  </div>
                  <p className="text-lg font-bold text-blue-700">
                    +${payrollData.currentMonth.bonus.toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <FaFileInvoiceDollar className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Detailed breakdown available for current month only</p>
              </div>
            )}
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Deductions</h3>
            <FaPercentage className="text-red-500" />
          </div>
          
          <div className="space-y-4">
            {selectedMonthData === payrollData?.currentMonth ? (
              <>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Income Tax</p>
                    <p className="text-sm text-gray-600">Tax deducted at source</p>
                  </div>
                  <p className="text-lg font-bold text-red-700">
                    -${payrollData.currentMonth.deductions.incomeTax.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Provident Fund</p>
                    <p className="text-sm text-gray-600">Employee contribution</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    -${payrollData.currentMonth.deductions.providentFund.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Professional Tax</p>
                    <p className="text-sm text-gray-600">State professional tax</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    -${payrollData.currentMonth.deductions.professionalTax.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Loan Deduction</p>
                    <p className="text-sm text-gray-600">Company loan EMI</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    -${payrollData.currentMonth.deductions.loanDeduction.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Other Deductions</p>
                    <p className="text-sm text-gray-600">Miscellaneous deductions</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    -${payrollData.currentMonth.deductions.otherDeductions.toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <FaFileInvoiceDollar className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-500">Detailed breakdown available for current month only</p>
              </div>
            )}
          </div>
          
          {selectedMonthData === payrollData?.currentMonth && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">Total Deductions</span>
                <span className="text-xl font-bold text-red-600">
                  -${payrollData.currentMonth.totalDeductions.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Salary History */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Salary History</h3>
            <p className="text-gray-600">Previous months' salary records</p>
          </div>
          <FaHistory className="text-gray-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Salary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payrollData?.salaryHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      {item.month}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    ${item.grossSalary.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-red-600">
                    -${item.deductions.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-bold text-gray-900">
                      ${item.netSalary.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{item.paymentDate}</td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewPaySlip(item)}
                        className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg"
                        title="View Payslip"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => downloadPaySlip('pdf')}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
                        title="Download PDF"
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits & Tax Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Benefits */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Employee Benefits</h3>
            <FaBuilding className="text-purple-500" />
          </div>
          
          <div className="space-y-4">
            {payrollData?.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{benefit.name}</p>
                  <p className="text-sm text-gray-600">{benefit.value}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{benefit.balance || benefit.amount || ''}</p>
                  <p className="text-xs text-gray-500">{benefit.provider || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Information */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Tax Information</h3>
            <FaCreditCard className="text-blue-500" />
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">PAN Number</p>
                  <p className="font-bold text-gray-800">{payrollData?.taxInfo.panNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Tax Slab</p>
                  <p className="font-bold text-blue-700">{payrollData?.taxInfo.taxSlab}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Financial Year</p>
                <p className="font-medium text-gray-800">{payrollData?.taxInfo.financialYear}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Taxable Income</p>
                <p className="font-medium text-gray-800">${payrollData?.taxInfo.totalTaxableIncome.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Tax Paid</p>
                <p className="font-medium text-green-700">${payrollData?.taxInfo.taxPaid.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Tax Due</p>
                <p className="font-medium text-red-700">${payrollData?.taxInfo.taxDue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Slip Modal */}
      <Modal
        isOpen={showPaySlipModal}
        onClose={() => {
          setShowPaySlipModal(false);
          setSelectedPaySlip(null);
        }}
        title={`Payslip - ${selectedPaySlip?.month || selectedMonth}`}
        size="xl"
      >
        {selectedPaySlip && (
          <div className="space-y-6">
            {/* Company Header */}
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">DAYFLOW HRMS</h2>
              <p className="text-gray-600">Salary Payslip</p>
              <p className="text-sm text-gray-500">{selectedPaySlip.month}</p>
            </div>

            {/* Employee & Company Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Employee Details</h4>
                <div className="space-y-1">
                  <p><strong>Name:</strong> {payrollData?.employeeName}</p>
                  <p><strong>ID:</strong> {payrollData?.employeeId}</p>
                  <p><strong>Department:</strong> {payrollData?.department}</p>
                  <p><strong>Position:</strong> {payrollData?.position}</p>
                </div>
              </div>
              
              <div className="text-right">
                <h4 className="font-semibold text-gray-800 mb-2">Payment Details</h4>
                <div className="space-y-1">
                  <p><strong>Payment Date:</strong> {selectedPaySlip.paymentDate}</p>
                  <p><strong>Payment Method:</strong> Bank Transfer</p>
                  <p><strong>Account:</strong> {payrollData?.currentMonth.accountNumber}</p>
                  <p><strong>Bank:</strong> {payrollData?.currentMonth.bankName}</p>
                </div>
              </div>
            </div>

            {/* Salary Details Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Amount ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-800">Basic Salary</td>
                    <td className="px-4 py-3 text-right">{payrollData?.currentMonth.basicSalary.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-600">House Rent Allowance</td>
                    <td className="px-4 py-3 text-right">{payrollData?.currentMonth.houseRentAllowance.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-600">Medical Allowance</td>
                    <td className="px-4 py-3 text-right">{payrollData?.currentMonth.medicalAllowance.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-600">Special Allowance</td>
                    <td className="px-4 py-3 text-right">{payrollData?.currentMonth.specialAllowance.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 font-medium text-gray-800">Total Earnings</td>
                    <td className="px-4 py-3 text-right font-bold">{selectedPaySlip.grossSalary.toLocaleString()}</td>
                  </tr>
                  
                  {/* Deductions */}
                  <tr className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-800">Income Tax</td>
                    <td className="px-4 py-3 text-right text-red-600">-{payrollData?.currentMonth.deductions.incomeTax.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-600">Provident Fund</td>
                    <td className="px-4 py-3 text-right text-red-600">-{payrollData?.currentMonth.deductions.providentFund.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-600">Professional Tax</td>
                    <td className="px-4 py-3 text-right text-red-600">-{payrollData?.currentMonth.deductions.professionalTax.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 font-medium text-gray-800">Total Deductions</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">-{selectedPaySlip.deductions.toLocaleString()}</td>
                  </tr>
                  
                  {/* Net Salary */}
                  <tr className="border-t bg-gradient-to-r from-green-50 to-emerald-50">
                    <td className="px-4 py-3 font-bold text-lg text-gray-800">Net Salary Payable</td>
                    <td className="px-4 py-3 text-right font-bold text-2xl text-green-800">
                      ${selectedPaySlip.netSalary.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Notes */}
            <div className="text-sm text-gray-500 border-t pt-4">
              <p><strong>Notes:</strong></p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>This is a computer-generated payslip and does not require a signature.</li>
                <li>All amounts are in US Dollars ($).</li>
                <li>For any queries, please contact the HR department.</li>
                <li>Keep this payslip for your records and tax purposes.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => downloadPaySlip('pdf')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center"
              >
                <FaFilePdf className="mr-2" />
                Download PDF
              </button>
              <button
                onClick={printPaySlip}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center"
              >
                <FaPrint className="mr-2" />
                Print Payslip
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PayrollView;