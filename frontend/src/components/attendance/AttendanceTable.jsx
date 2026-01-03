import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaDownload, 
  FaPrint, 
  FaEye, 
  FaEdit, 
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaCalendarDay
} from 'react-icons/fa';

const AttendanceTable = ({ view = 'employee' }) => {
  // States
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // For admin view
  const employees = [
    { id: 1, name: 'John Doe', employeeId: 'EMP001', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', employeeId: 'EMP002', department: 'HR' },
    { id: 3, name: 'Robert Johnson', employeeId: 'EMP003', department: 'Sales' },
    { id: 4, name: 'Sarah Williams', employeeId: 'EMP004', department: 'Marketing' },
    { id: 5, name: 'Mike Brown', employeeId: 'EMP005', department: 'Engineering' },
    { id: 6, name: 'Lisa Davis', employeeId: 'EMP006', department: 'Finance' },
    { id: 7, name: 'Tom Wilson', employeeId: 'EMP007', department: 'Operations' },
    { id: 8, name: 'Emily Taylor', employeeId: 'EMP008', department: 'Engineering' },
  ];

  // Generate mock attendance data
  const generateMockData = () => {
    const records = [];
    const today = new Date();
    const statuses = ['present', 'absent', 'half-day', 'leave'];
    
    // Generate last 30 days of data
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const status = isWeekend ? 'weekend' : statuses[Math.floor(Math.random() * statuses.length)];
      
      let checkIn = null;
      let checkOut = null;
      let hours = 0;
      let overtime = 0;
      
      if (status === 'present' || status === 'half-day') {
        checkIn = `09:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`;
        checkOut = status === 'present' 
          ? `06:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM` 
          : `01:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`;
        
        hours = status === 'present' ? 9 : 4;
        overtime = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
      }
      
      // For admin view, create records for each employee
      if (view === 'admin') {
        employees.forEach(employee => {
          const employeeStatus = Math.random() > 0.1 ? status : statuses[Math.floor(Math.random() * statuses.length)];
          const employeeHours = employeeStatus === 'present' ? 9 : employeeStatus === 'half-day' ? 4 : 0;
          
          records.push({
            id: `${employee.id}-${i}`,
            employeeId: employee.employeeId,
            employeeName: employee.name,
            department: employee.department,
            date: dateString,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            status: employeeStatus,
            checkIn: employeeStatus === 'present' || employeeStatus === 'half-day' ? checkIn : '--',
            checkOut: employeeStatus === 'present' || employeeStatus === 'half-day' ? checkOut : '--',
            hours: employeeHours,
            overtime,
            remarks: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Late arrival' : 'Early departure') : '',
            regularized: Math.random() > 0.7,
            approvalStatus: Math.random() > 0.5 ? 'approved' : 'pending'
          });
        });
      } else {
        // For employee view
        records.push({
          id: i,
          date: dateString,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          status,
          checkIn,
          checkOut,
          hours,
          overtime,
          remarks: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Late arrival' : 'Early departure') : '',
          regularized: Math.random() > 0.7,
          approvalStatus: Math.random() > 0.5 ? 'approved' : 'pending'
        });
      }
    }
    
    return records;
  };

  // Initialize data
  useEffect(() => {
    const data = generateMockData();
    setAttendanceRecords(data);
    setFilteredRecords(data);
  }, [view]);

  // Filter and search
  useEffect(() => {
    let filtered = [...attendanceRecords];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => {
        if (view === 'admin') {
          return (
            record.employeeName.toLowerCase().includes(term) ||
            record.employeeId.toLowerCase().includes(term) ||
            record.department.toLowerCase().includes(term)
          );
        }
        return record.date.includes(term) || record.day.toLowerCase().includes(term);
      });
    }
    
    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(record => record.date === dateFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortConfig.key === 'hours') {
        return sortConfig.direction === 'asc' ? a.hours - b.hours : b.hours - a.hours;
      }
      if (sortConfig.key === 'name' && view === 'admin') {
        return sortConfig.direction === 'asc' 
          ? a.employeeName.localeCompare(b.employeeName)
          : b.employeeName.localeCompare(a.employeeName);
      }
      return 0;
    });
    
    setFilteredRecords(filtered);
    setCurrentPage(1);
  }, [searchTerm, dateFilter, statusFilter, sortConfig, attendanceRecords, view]);

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Status badge component
  const StatusBadge = ({ status, regularized, approvalStatus }) => {
    const getStatusConfig = () => {
      switch(status) {
        case 'present':
          return {
            text: 'Present',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            icon: <FaCheckCircle />,
            dotColor: 'bg-green-500'
          };
        case 'absent':
          return {
            text: 'Absent',
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            icon: <FaTimesCircle />,
            dotColor: 'bg-red-500'
          };
        case 'half-day':
          return {
            text: 'Half Day',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            icon: <FaExclamationCircle />,
            dotColor: 'bg-yellow-500'
          };
        case 'leave':
          return {
            text: 'Leave',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            icon: <FaCalendarDay />,
            dotColor: 'bg-blue-500'
          };
        case 'weekend':
          return {
            text: 'Weekend',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            icon: <FaCalendarAlt />,
            dotColor: 'bg-gray-500'
          };
        default:
          return {
            text: status,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            icon: <FaClock />,
            dotColor: 'bg-gray-500'
          };
      }
    };

    const config = getStatusConfig();
    
    return (
      <div className="flex items-center space-x-2">
        <div className={`flex items-center ${config.bgColor} ${config.textColor} px-3 py-1 rounded-full text-sm font-medium`}>
          <span className="mr-1">{config.icon}</span>
          {config.text}
        </div>
        
        {regularized && status !== 'present' && (
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            Regularized
          </span>
        )}
        
        {approvalStatus && approvalStatus === 'pending' && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Pending
          </span>
        )}
      </div>
    );
  };

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  // Calculate summary stats
  const calculateStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      halfDay: 0,
      leave: 0,
      totalHours: 0,
      averageHours: 0,
      overtime: 0
    };

    filteredRecords.forEach(record => {
      if (record.status === 'present') stats.present++;
      if (record.status === 'absent') stats.absent++;
      if (record.status === 'half-day') stats.halfDay++;
      if (record.status === 'leave') stats.leave++;
      
      stats.totalHours += record.hours || 0;
      stats.overtime += record.overtime || 0;
    });

    stats.averageHours = filteredRecords.length > 0 
      ? (stats.totalHours / filteredRecords.length).toFixed(1) 
      : 0;

    return stats;
  };

  const stats = calculateStats();

  // View record details
  const viewRecordDetails = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = view === 'admin' 
      ? ['Employee ID', 'Employee Name', 'Department', 'Date', 'Day', 'Status', 'Check In', 'Check Out', 'Hours', 'Overtime', 'Remarks']
      : ['Date', 'Day', 'Status', 'Check In', 'Check Out', 'Hours', 'Overtime', 'Remarks'];
    
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => {
        const row = view === 'admin' 
          ? [
              record.employeeId,
              record.employeeName,
              record.department,
              record.date,
              record.day,
              record.status,
              record.checkIn,
              record.checkOut,
              record.hours,
              record.overtime,
              `"${record.remarks || ''}"`
            ]
          : [
              record.date,
              record.day,
              record.status,
              record.checkIn,
              record.checkOut,
              record.hours,
              record.overtime,
              `"${record.remarks || ''}"`
            ];
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${view}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setStatusFilter('all');
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {view === 'admin' ? 'Employee Attendance Records' : 'My Attendance Records'}
          </h2>
          <p className="text-gray-600">
            {view === 'admin' ? 'Manage and track all employee attendance' : 'View your daily attendance history'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition flex items-center"
          >
            <FaDownload className="mr-2" />
            Export CSV
          </button>
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition flex items-center">
            <FaPrint className="mr-2" />
            Print Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-700">{stats.present}</div>
              <div className="text-sm text-green-600">Present Days</div>
            </div>
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-700">{stats.absent}</div>
              <div className="text-sm text-red-600">Absent Days</div>
            </div>
            <FaTimesCircle className="text-red-500 text-xl" />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-700">{stats.halfDay}</div>
              <div className="text-sm text-yellow-600">Half Days</div>
            </div>
            <FaExclamationCircle className="text-yellow-500 text-xl" />
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-700">{stats.totalHours}</div>
              <div className="text-sm text-blue-600">Total Hours</div>
            </div>
            <FaClock className="text-blue-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={view === 'admin' ? 'Search by name or ID...' : 'Search by date...'}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half-day">Half Day</option>
              <option value="leave">Leave</option>
              <option value="weekend">Weekend</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Records Per Page */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Show</span>
            <select
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-gray-600 ml-2">entries</span>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} entries
          </div>
        </div>
        
        {filteredRecords.length > 0 && (
          <div className="text-sm text-gray-600">
            Average Hours: <span className="font-bold">{stats.averageHours}</span> | 
            Overtime: <span className="font-bold">{stats.overtime}</span> hours
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {view === 'admin' && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Employee <FaSort className="ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                </>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('date')}
                  className="flex items-center hover:text-gray-700"
                >
                  Date <FaSort className="ml-1" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('hours')}
                  className="flex items-center hover:text-gray-700"
                >
                  Hours <FaSort className="ml-1" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  {view === 'admin' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <FaUser className="text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{record.employeeName}</div>
                            <div className="text-sm text-gray-500">{record.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {record.department}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{record.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{record.day}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={record.status} 
                      regularized={record.regularized}
                      approvalStatus={record.approvalStatus}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`font-medium ${
                      record.checkIn === '--' ? 'text-gray-400' : 'text-gray-900'
                    }`}>
                      {record.checkIn}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`font-medium ${
                      record.checkOut === '--' ? 'text-gray-400' : 'text-gray-900'
                    }`}>
                      {record.checkOut}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{record.hours} hrs</div>
                    {record.overtime > 0 && (
                      <div className="text-sm text-green-600">+{record.overtime} OT</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {record.remarks || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewRecordDetails(record)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {view === 'admin' && record.status !== 'present' && !record.regularized && (
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Regularize"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={view === 'admin' ? 10 : 8} 
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center">
                    <FaCalendarAlt className="text-gray-400 text-4xl mb-3" />
                    <p className="text-gray-500">No attendance records found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your filters or search term
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredRecords.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between mt-6">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Attendance Details</h3>
                  <p className="text-gray-600">Complete record information</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {view === 'admin' && (
                  <>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <FaUser className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{selectedRecord.employeeName}</div>
                        <div className="text-sm text-gray-500">
                          {selectedRecord.employeeId} • {selectedRecord.department}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">{selectedRecord.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Day</p>
                    <p className="font-medium text-gray-800">{selectedRecord.day}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge 
                      status={selectedRecord.status} 
                      regularized={selectedRecord.regularized}
                      approvalStatus={selectedRecord.approvalStatus}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Check In</p>
                    <p className="font-medium text-gray-800">{selectedRecord.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check Out</p>
                    <p className="font-medium text-gray-800">{selectedRecord.checkOut}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Hours</p>
                    <p className="font-medium text-gray-800">{selectedRecord.hours} hours</p>
                  </div>
                  {selectedRecord.overtime > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Overtime</p>
                      <p className="font-medium text-green-700">{selectedRecord.overtime} hours</p>
                    </div>
                  )}
                </div>
                
                {selectedRecord.remarks && (
                  <div>
                    <p className="text-sm text-gray-500">Remarks</p>
                    <p className="font-medium text-gray-800">{selectedRecord.remarks}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Actions</p>
                  <div className="flex space-x-3">
                    {!selectedRecord.regularized && selectedRecord.status !== 'present' && (
                      <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition">
                        Request Regularization
                      </button>
                    )}
                    <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition">
                      Download Slip
                    </button>
                    {view === 'admin' && (
                      <button className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition">
                        Mark as Irregular
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;