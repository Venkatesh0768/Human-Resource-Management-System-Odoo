import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUser, 
  FaCalendarCheck, 
  FaClock, 
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartBar 
} from 'react-icons/fa';
import DashboardCard from './DashboardCard';
import AttendanceCalendar from '../attendance/AttendanceCalendar';
import CheckInOut from '../attendance/CheckInOut';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    attendance: 95,
    leaveBalance: 12,
    pendingApprovals: 3,
    monthlyHours: 160
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Leave Request Submitted', date: '2024-01-10', status: 'pending' },
    { id: 2, action: 'Attendance Regularized', date: '2024-01-09', status: 'approved' },
    { id: 3, action: 'Profile Updated', date: '2024-01-08', status: 'completed' },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name || 'Employee'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your work today.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Attendance Rate"
          value={`${stats.attendance}%`}
          icon={<FaCalendarCheck className="text-blue-500 text-xl" />}
          color="blue"
          trend="+2% from last month"
        />
        <DashboardCard
          title="Leave Balance"
          value={`${stats.leaveBalance} days`}
          icon={<FaCalendarAlt className="text-green-500 text-xl" />}
          color="green"
        />
        <DashboardCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<FaClock className="text-yellow-500 text-xl" />}
          color="yellow"
        />
        <DashboardCard
          title="Monthly Hours"
          value={`${stats.monthlyHours} hrs`}
          icon={<FaChartBar className="text-purple-500 text-xl" />}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Check In/Out & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <CheckInOut />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-indigo-50 text-indigo-700 py-3 px-4 rounded-lg font-medium hover:bg-indigo-100 transition flex items-center justify-center">
                <FaCalendarCheck className="mr-2" />
                Apply for Leave
              </button>
              <button className="w-full bg-green-50 text-green-700 py-3 px-4 rounded-lg font-medium hover:bg-green-100 transition flex items-center justify-center">
                <FaUser className="mr-2" />
                Update Profile
              </button>
              <button className="w-full bg-blue-50 text-blue-700 py-3 px-4 rounded-lg font-medium hover:bg-blue-100 transition flex items-center justify-center">
                <FaMoneyBillWave className="mr-2" />
                View Payslip
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Calendar & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <AttendanceCalendar />
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                  <div>
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
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
      </div>
    </div>
  );
};

export default EmployeeDashboard;