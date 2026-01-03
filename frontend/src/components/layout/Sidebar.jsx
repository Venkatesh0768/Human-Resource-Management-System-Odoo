import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaCalendarDay,
  FaMoneyBillWave,
  FaChartBar,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaBell,
  FaQuestionCircle,
  FaUserCircle
} from 'react-icons/fa';

const Sidebar = ({ isMobile, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  // Employee menu items
  const employeeMenu = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/employee/profile', label: 'My Profile', icon: <FaUser /> },
    { path: '/employee/attendance', label: 'Attendance', icon: <FaCalendarAlt /> },
    { path: '/employee/leave', label: 'Leave Management', icon: <FaCalendarDay /> },
    { path: '/employee/payroll', label: 'Payroll', icon: <FaMoneyBillWave /> },
  ];

  // Admin menu items
  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/admin/employees', label: 'Employees', icon: <FaUsers /> },
    { path: '/admin/attendance', label: 'Attendance', icon: <FaCalendarAlt /> },
    { path: '/admin/leave', label: 'Leave Approvals', icon: <FaCalendarDay /> },
    { path: '/admin/payroll', label: 'Payroll', icon: <FaMoneyBillWave /> },
    { path: '/admin/reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  // Settings menu (common for all)
  const settingsMenu = [
    { path: '/settings', label: 'Settings', icon: <FaCog /> },
    { path: '/help', label: 'Help & Support', icon: <FaQuestionCircle /> },
    { path: '/notifications', label: 'Notifications', icon: <FaBell /> },
  ];

  const menu = user?.role === 'admin' ? adminMenu : employeeMenu;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`h-full flex flex-col bg-white border-r border-gray-200 ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">D</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Dayflow HRMS</h1>
                  <p className="text-xs text-gray-500">Every workday, perfectly aligned</p>
                </div>
              </div>
              {!isMobile && (
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  title="Collapse sidebar"
                >
                  <FaChevronLeft />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="mt-4 p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                title="Expand sidebar"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
          
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 lg:hidden"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        {!collapsed ? (
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <FaUserCircle className="text-indigo-600 text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role || 'employee'}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-indigo-600 text-xl" />
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${collapsed ? 'text-center' : 'px-3'} mb-2`}>
            Main Menu
          </p>
          
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => `
                flex items-center ${collapsed ? 'justify-center p-3' : 'px-4 py-3'} rounded-lg transition
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
              title={collapsed ? item.label : ''}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="mt-8 space-y-1">
          <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${collapsed ? 'text-center' : 'px-3'} mb-2`}>
            Settings
          </p>
          
          {settingsMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center ${collapsed ? 'justify-center p-3' : 'px-4 py-3'} rounded-lg transition
                ${isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
              title={collapsed ? item.label : ''}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`
            flex items-center w-full ${collapsed ? 'justify-center p-3' : 'px-4 py-3'} 
            text-red-600 hover:bg-red-50 rounded-lg transition
          `}
          title={collapsed ? 'Logout' : ''}
        >
          <FaSignOutAlt className="text-lg" />
          {!collapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;