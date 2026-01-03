import React, { useState, useEffect } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const CheckInOut = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString();
    setCheckInTime(now);
    setCheckedIn(true);
    // API call to backend
    console.log('Checked in at:', now);
  };

  const handleCheckOut = () => {
    const now = new Date().toLocaleTimeString();
    setCheckedIn(false);
    // API call to backend
    console.log('Checked out at:', now);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance</h3>
      
      {/* Current Time Display */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-1">Current Time</p>
        <p className="text-2xl font-bold text-gray-800">{currentTime}</p>
      </div>

      {/* Check In/Out Button */}
      <div className="space-y-4">
        {checkedIn ? (
          <>
            <div className="text-center p-4 bg-green-50 rounded-lg mb-4">
              <p className="text-sm text-gray-600">Checked in at</p>
              <p className="text-xl font-bold text-green-700">{checkInTime}</p>
            </div>
            <button
              onClick={handleCheckOut}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center"
            >
              <FaSignOutAlt className="mr-2" />
              Check Out
            </button>
          </>
        ) : (
          <button
            onClick={handleCheckIn}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center"
          >
            <FaSignInAlt className="mr-2" />
            Check In
          </button>
        )}
      </div>

      {/* Attendance Status */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="font-medium text-gray-700 mb-2">Today's Status</h4>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-800 font-medium">
            {checkedIn ? 'Working' : 'Not Checked In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;