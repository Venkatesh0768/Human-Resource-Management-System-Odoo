import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import LoadingSpinner from '../common/LoadingSpinner';

const Layout = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Auto-close sidebar on mobile when clicking outside
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.sidebar-container') && !e.target.closest('.sidebar-toggle')) {
          setSidebarOpen(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [sidebarOpen, isMobile]);

  // Handle page transitions
  useEffect(() => {
    const handleStart = () => setPageLoading(true);
    const handleComplete = () => {
      setTimeout(() => setPageLoading(false), 300);
    };

    // Simulate loading for demo (remove in production)
    handleStart();
    const timer = setTimeout(handleComplete, 500);

    return () => clearTimeout(timer);
  }, [location]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    
    const titleMap = {
      '/employee/dashboard': 'Dashboard',
      '/employee/profile': 'My Profile',
      '/employee/attendance': 'Attendance',
      '/employee/leave': 'Leave Management',
      '/employee/payroll': 'Payroll',
      '/admin/dashboard': 'Admin Dashboard',
      '/admin/employees': 'Employee Management',
      '/admin/attendance': 'Attendance Reports',
      '/admin/leave': 'Leave Approvals',
      '/admin/payroll': 'Payroll Management',
      '/admin/reports': 'Analytics & Reports',
    };

    return titleMap[path] || 'Dayflow HRMS';
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner 
          size="lg" 
          type="ring" 
          text="Loading your dashboard..."
        />
      </div>
    );
  }

  // If no user (but authLoading is false), redirect happens in useEffect
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        sidebar-container
        fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0
      `}>
        <Sidebar 
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar 
          pageTitle={getPageTitle()}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {/* Page Loading Indicator */}
          {pageLoading && (
            <div className="sticky top-0 z-30">
              <div className="h-1 bg-gray-200">
                <div className="h-full bg-indigo-600 animate-progress"></div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-4 md:p-6">
            {pageLoading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner 
                  size="md"
                  type="dots"
                  text="Loading content..."
                />
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>

        {/* Footer (Optional) */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Dayflow HRMS. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">
                Help & Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;