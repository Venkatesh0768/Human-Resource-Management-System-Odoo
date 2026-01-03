import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaClock,
  FaUserPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaFilter,
  FaDownload
} from 'react-icons/fa';
import DashboardCard from './DashboardCard';
import DataTable from '../common/DataTable';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 124,
    presentToday: 89,
    pendingApprovals: 12,
    monthlySalary: 245000,
    leaveRequests: 8,
    newHires: 5
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: 'John Doe', action: 'Leave Request Submitted', time: '10:30 AM', status: 'pending' },
    { id: 2, user: 'Sarah Smith', action: 'Attendance Regularized', time: '09:45 AM', status: 'approved' },
    { id: 3, user: 'Mike Johnson', action: 'Salary Updated', time: 'Yesterday', status: 'completed' },
    { id: 4, user: 'Lisa Brown', action: 'New Employee Onboarded', time: 'Yesterday', status: 'completed' },
    { id: 5, user: 'Robert Wilson', action: 'Leave Request Approved', time: '2 days ago', status: 'approved' }
  ]);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', department: 'Engineering', status: 'active', attendance: '95%', lastActive: 'Today' },
    { id: 2, name: 'Jane Smith', department: 'HR', status: 'active', attendance: '98%', lastActive: 'Today' },
    { id: 3, name: 'Mike Johnson', department: 'Sales', status: 'on-leave', attendance: '85%', lastActive: '2 days ago' },
    { id: 4, name: 'Sarah Williams', department: 'Marketing', status: 'active', attendance: '92%', lastActive: 'Today' },
    { id: 5, name: 'Robert Brown', department: 'Finance', status: 'inactive', attendance: '76%', lastActive: '1 week ago' }
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, type: 'Leave', employee: 'John Doe', duration: '3 days', date: '2024-01-15', status: 'pending' },
    { id: 2, type: 'Attendance', employee: 'Mike Johnson', duration: '1 day', date: '2024-01-14', status: 'pending' },
    { id: 3, type: 'Salary', employee: 'Sarah Williams', duration: 'N/A', date: '2024-01-13', status: 'pending' },
    { id: 4, type: 'Leave', employee: 'Lisa Davis', duration: '5 days', date: '2024-01-12', status: 'pending' }
  ]);

  // Mock data for charts
  const [attendanceData] = useState([
    { day: 'Mon', present: 89, absent: 11 },
    { day: 'Tue', present: 92, absent: 8 },
    { day: 'Wed', present: 88, absent: 12 },
    { day: 'Thu', present: 94, absent: 6 },
    { day: 'Fri', present: 91, absent: 9 },
    { day: 'Sat', present: 45, absent: 55 },
    { day: 'Sun', present: 10, absent: 90 }
  ]);

  const [departmentData] = useState([
    { department: 'Engineering', employees: 45, attendance: '96%' },
    { department: 'HR', employees: 12, attendance: '98%' },
    { department: 'Sales', employees: 28, attendance: '92%' },
    { department: 'Marketing', employees: 22, attendance: '94%' },
    { department: 'Finance', employees: 17, attendance: '97%' }
  ]);

  const columns = [
    { 
      key: 'name', 
      title: 'Employee Name', 
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
            <FaUsers className="text-indigo-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">ID: EMP{row.id.toString().padStart(3, '0')}</div>
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
      key: 'status', 
      title: 'Status', 
      sortable: true,
      render: (value) => {
        const statusConfig = {
          active: { color: 'green', text: 'Active' },
          'on-leave': { color: 'yellow', text: 'On Leave' },
          inactive: { color: 'red', text: 'Inactive' }
        };
        const config = statusConfig[value] || { color: 'gray', text: value };
        
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800`}>
            <div className={`w-2 h-2 rounded-full bg-${config.color}-500 mr-2`}></div>
            {config.text}
          </span>
        );
      }
    },
    { 
      key: 'attendance', 
      title: 'Attendance', 
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: value }}
            />
          </div>
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { 
      key: 'lastActive', 
      title: 'Last Active', 
      sortable: true 
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button className="text-indigo-600 hover:text-indigo-900" title="View">
            <FaSearch />
          </button>
          <button className="text-green-600 hover:text-green-900" title="Edit">
            <FaUsers />
          </button>
        </div>
      )
    }
  ];

  const handleViewEmployee = (employee) => {
    alert(`Viewing ${employee.name}`);
  };

  const handleEditEmployee = (employee) => {
    alert(`Editing ${employee.name}`);
  };

  const handleExportData = () => {
    alert('Exporting data...');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.name || 'Admin'}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your organization today.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center">
              <FaUserPlus className="mr-2" />
              Add Employee
            </button>
            <button 
              onClick={handleExportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center"
            >
              <FaDownload className="mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <DashboardCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<FaUsers className="text-blue-500 text-xl" />}
          color="blue"
          trend="+5 this month"
          trendUp={true}
        />
        <DashboardCard
          title="Present Today"
          value={stats.presentToday}
          icon={<FaCalendarCheck className="text-green-500 text-xl" />}
          color="green"
          trend="89% attendance"
        />
        <DashboardCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<FaClock className="text-yellow-500 text-xl" />}
          color="yellow"
          trend="Need attention"
          trendUp={false}
        />
        <DashboardCard
          title="Monthly Salary"
          value={`$${(stats.monthlySalary / 1000).toFixed(1)}k`}
          icon={<FaMoneyBillWave className="text-purple-500 text-xl" />}
          color="purple"
          trend="+3.2% from last month"
          trendUp={true}
        />
        <DashboardCard
          title="Leave Requests"
          value={stats.leaveRequests}
          icon={<FaCalendarCheck className="text-red-500 text-xl" />}
          color="red"
          trend="Pending approval"
        />
        <DashboardCard
          title="New Hires"
          value={stats.newHires}
          icon={<FaUserPlus className="text-indigo-500 text-xl" />}
          color="indigo"
          trend="This month"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      activity.status === 'approved' ? 'bg-green-100' :
                      activity.status === 'pending' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.status === 'approved' ? (
                        <FaCheckCircle className="text-green-600" />
                      ) : activity.status === 'pending' ? (
                        <FaClock className="text-yellow-600" />
                      ) : (
                        <FaCheckCircle className="text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-500">
                        by {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Overview</h3>
            <div className="space-y-4">
              {attendanceData.map((day, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{day.day}</span>
                    <span>{day.present}% present</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${day.present}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Weekly Average</span>
                <span className="font-bold text-gray-800">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Pending Approvals</h3>
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <FaFilter className="inline mr-1" /> Filter
            </button>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      request.type === 'Leave' ? 'bg-blue-100 text-blue-800' :
                      request.type === 'Attendance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {request.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">{request.employee}</td>
                  <td className="px-4 py-4 text-gray-700">{request.duration}</td>
                  <td className="px-4 py-4 text-gray-700">{request.date}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <FaClock className="mr-1" />
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
                        Reject
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Employee Management</h3>
            <p className="text-gray-600 text-sm mt-1">Manage all employees in the organization</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>HR</option>
              <option>Sales</option>
              <option>Marketing</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={employees}
          title=""
          onRowClick={handleViewEmployee}
          searchable={false}
          pagination={false}
          compact={true}
        />
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Department Overview</h3>
          <div className="space-y-4">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <FaUsers className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{dept.department}</p>
                    <p className="text-sm text-gray-500">{dept.employees} employees</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{dept.attendance}</p>
                  <p className="text-sm text-gray-500">Attendance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition flex flex-col items-center">
              <FaCalendarCheck className="text-blue-600 text-2xl mb-2" />
              <span className="font-medium text-blue-800">Approve Leave</span>
              <span className="text-sm text-blue-600 mt-1">12 pending</span>
            </button>
            <button className="p-4 bg-green-50 border border-green-100 rounded-xl hover:bg-green-100 transition flex flex-col items-center">
              <FaMoneyBillWave className="text-green-600 text-2xl mb-2" />
              <span className="font-medium text-green-800">Process Payroll</span>
              <span className="text-sm text-green-600 mt-1">Due today</span>
            </button>
            <button className="p-4 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 transition flex flex-col items-center">
              <FaUserPlus className="text-purple-600 text-2xl mb-2" />
              <span className="font-medium text-purple-800">Onboard New</span>
              <span className="text-sm text-purple-600 mt-1">5 candidates</span>
            </button>
            <button className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl hover:bg-yellow-100 transition flex flex-col items-center">
              <FaChartLine className="text-yellow-600 text-2xl mb-2" />
              <span className="font-medium text-yellow-800">View Reports</span>
              <span className="text-sm text-yellow-600 mt-1">Monthly insights</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;