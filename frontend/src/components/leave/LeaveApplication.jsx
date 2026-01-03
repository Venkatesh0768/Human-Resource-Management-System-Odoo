import React, { useState } from 'react';
import { FaCalendarAlt, FaStickyNote } from 'react-icons/fa';

const LeaveApplication = () => {
  const [formData, setFormData] = useState({
    leaveType: 'paid',
    startDate: '',
    endDate: '',
    remarks: '',
    duration: 1
  });

  const leaveTypes = [
    { value: 'paid', label: 'Paid Leave', color: 'blue' },
    { value: 'sick', label: 'Sick Leave', color: 'red' },
    { value: 'unpaid', label: 'Unpaid Leave', color: 'yellow' },
    { value: 'emergency', label: 'Emergency Leave', color: 'orange' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to submit leave application
    console.log('Leave application submitted:', formData);
    alert('Leave application submitted successfully!');
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Apply for Leave</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Leave Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-3">Leave Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {leaveTypes.map(type => (
              <label
                key={type.value}
                className={`relative cursor-pointer ${
                  formData.leaveType === type.value
                    ? 'ring-2 ring-offset-2 ring-indigo-500'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="leaveType"
                  value={type.value}
                  checked={formData.leaveType === type.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`p-4 rounded-lg border text-center transition ${
                  formData.leaveType === type.value
                    ? `bg-${type.color}-50 border-${type.color}-300`
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-${type.color}-100 flex items-center justify-center`}>
                    <FaCalendarAlt className={`text-${type.color}-600`} />
                  </div>
                  <span className={`font-medium ${
                    formData.leaveType === type.value
                      ? `text-${type.color}-800`
                      : 'text-gray-700'
                  }`}>
                    {type.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="mb-6">
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaStickyNote className="mr-2" />
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            placeholder="Additional details about your leave..."
          />
        </div>

        {/* Duration Display */}
        {formData.startDate && formData.endDate && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              Total Leave Duration: <span className="font-bold">5 days</span>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center"
        >
          Submit Leave Application
        </button>
      </form>
    </div>
  );
};

export default LeaveApplication;