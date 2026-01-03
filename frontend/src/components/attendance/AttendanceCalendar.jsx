import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Days of the week
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Attendance status types
  const attendanceTypes = [
    { id: 'present', label: 'Present', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
    { id: 'absent', label: 'Absent', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' },
    { id: 'half-day', label: 'Half Day', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
    { id: 'leave', label: 'Leave', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
    { id: 'holiday', label: 'Holiday', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50' },
    { id: 'weekend', label: 'Weekend', color: 'bg-gray-400', textColor: 'text-gray-700', bgColor: 'bg-gray-100' },
  ];

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar dates
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const daysArray = [];
    
    // Previous month days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      daysArray.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
        dateString: date.toISOString().split('T')[0]
      });
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      daysArray.push({
        day,
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        dateString
      });
    }
    
    // Next month days
    const totalCells = 42; // 6 weeks * 7 days
    const nextMonthDays = totalCells - daysArray.length;
    for (let day = 1; day <= nextMonthDays; day++) {
      const date = new Date(year, month + 1, day);
      daysArray.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
        dateString: date.toISOString().split('T')[0]
      });
    }
    
    return daysArray;
  };

  // Get random attendance status for demo
  const getRandomAttendance = (date) => {
    // For weekends (Saturday, Sunday)
    if (date.getDay() === 0 || date.getDay() === 6) {
      return 'weekend';
    }
    
    // For holidays (random)
    const isHoliday = Math.random() < 0.05; // 5% chance of holiday
    if (isHoliday) {
      return 'holiday';
    }
    
    const statuses = ['present', 'present', 'present', 'present', 'half-day', 'leave', 'absent'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Initialize attendance data
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    const data = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      data[dateString] = {
        status: getRandomAttendance(date),
        checkIn: date.getDay() !== 0 && date.getDay() !== 6 ? '09:00 AM' : null,
        checkOut: date.getDay() !== 0 && date.getDay() !== 6 ? '06:00 PM' : null,
        hours: date.getDay() !== 0 && date.getDay() !== 6 ? '9' : '0',
        remarks: Math.random() < 0.1 ? 'Late arrival' : ''
      };
    }
    
    setAttendanceData(data);
  }, [currentDate]);

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Get status info
  const getStatusInfo = (statusId) => {
    return attendanceTypes.find(type => type.id === statusId) || attendanceTypes[0];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate monthly stats
  const calculateMonthlyStats = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    let present = 0;
    let absent = 0;
    let halfDay = 0;
    let leave = 0;
    let totalHours = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const attendance = attendanceData[dateString];
      
      if (attendance) {
        switch(attendance.status) {
          case 'present': present++; break;
          case 'absent': absent++; break;
          case 'half-day': halfDay++; break;
          case 'leave': leave++; break;
          default: break;
        }
        totalHours += parseInt(attendance.hours) || 0;
      }
    }
    
    const workingDays = daysInMonth - Math.floor(daysInMonth / 7) * 2; // Approximate
    const attendanceRate = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0;
    
    return { present, absent, halfDay, leave, totalHours, attendanceRate, workingDays };
  };

  const calendarDays = generateCalendar();
  const monthlyStats = calculateMonthlyStats();
  const selectedAttendance = attendanceData[selectedDate];
  const selectedStatus = selectedAttendance ? getStatusInfo(selectedAttendance.status) : null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance Calendar</h2>
          <p className="text-gray-600">Track your daily attendance and working hours</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition"
          >
            Today
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            
            <span className="text-lg font-semibold text-gray-800">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaArrowRight className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{monthlyStats.present}</div>
          <div className="text-sm text-green-600">Present Days</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-700">{monthlyStats.absent}</div>
          <div className="text-sm text-red-600">Absent Days</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700">{monthlyStats.halfDay}</div>
          <div className="text-sm text-yellow-600">Half Days</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{monthlyStats.leave}</div>
          <div className="text-sm text-blue-600">Leave Days</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">{monthlyStats.attendanceRate}%</div>
          <div className="text-sm text-purple-600">Attendance Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {days.map(day => (
              <div key={day} className="text-center font-medium text-gray-600 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayInfo, index) => {
              const attendance = attendanceData[dayInfo.dateString];
              const status = attendance ? getStatusInfo(attendance.status) : null;
              const isSelected = selectedDate === dayInfo.dateString;
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(dayInfo.dateString)}
                  className={`
                    p-3 rounded-lg text-center transition-all duration-200
                    ${dayInfo.isCurrentMonth ? '' : 'text-gray-400'}
                    ${dayInfo.isToday ? 'ring-2 ring-indigo-500' : ''}
                    ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}
                    ${status ? status.bgColor : 'bg-gray-50'}
                    hover:shadow-md hover:transform hover:-translate-y-1
                    ${!dayInfo.isCurrentMonth ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <div className={`text-lg font-semibold ${status?.textColor || 'text-gray-800'}`}>
                      {dayInfo.day}
                    </div>
                    {status && (
                      <div className={`w-2 h-2 rounded-full mt-1 ${status.color}`}></div>
                    )}
                    {attendance?.checkIn && (
                      <div className="text-xs text-gray-500 mt-1">
                        {attendance.hours}h
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium text-gray-700 mb-3">Legend</h4>
            <div className="flex flex-wrap gap-4">
              {attendanceTypes.map(type => (
                <div key={type.id} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${type.color}`}></div>
                  <span className="text-sm text-gray-600">{type.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Day Details</h3>
            
            {selectedAttendance ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">{formatDate(selectedDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center mt-1">
                    <div className={`w-3 h-3 rounded-full mr-2 ${selectedStatus?.color}`}></div>
                    <span className={`font-medium ${selectedStatus?.textColor}`}>
                      {selectedStatus?.label}
                    </span>
                  </div>
                </div>
                
                {selectedAttendance.checkIn && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Check In</p>
                        <p className="font-medium text-gray-800">{selectedAttendance.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Check Out</p>
                        <p className="font-medium text-gray-800">{selectedAttendance.checkOut}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Total Hours</p>
                      <p className="font-medium text-gray-800">{selectedAttendance.hours} hours</p>
                    </div>
                  </>
                )}
                
                {selectedAttendance.remarks && (
                  <div>
                    <p className="text-sm text-gray-500">Remarks</p>
                    <p className="font-medium text-gray-800">{selectedAttendance.remarks}</p>
                  </div>
                )}
                
                {selectedAttendance.status === 'absent' || selectedAttendance.status === 'half-day' ? (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      {selectedAttendance.status === 'absent' 
                        ? 'You were absent on this day. Please regularize if required.'
                        : 'You worked half day. Consider applying for leave for remaining hours.'}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCalendarAlt className="mx-auto text-gray-400 text-4xl mb-3" />
                <p className="text-gray-500">Select a date to view details</p>
              </div>
            )}
            
            {/* Monthly Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Monthly Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Working Days</span>
                  <span className="font-medium">{monthlyStats.workingDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours</span>
                  <span className="font-medium">{monthlyStats.totalHours} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Daily Hours</span>
                  <span className="font-medium">
                    {monthlyStats.present > 0 
                      ? (monthlyStats.totalHours / monthlyStats.present).toFixed(1) 
                      : 0} hrs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="font-medium text-gray-700 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition">
            Request Regularization
          </button>
          <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition">
            Download Monthly Report
          </button>
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition">
            View Attendance History
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;