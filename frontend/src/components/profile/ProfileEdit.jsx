import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
  FaBuilding,
  FaMoneyBillWave,
  FaGraduationCap,
  FaCertificate,
  FaCamera,
  FaUpload,
  FaTimes,
  FaSave
} from 'react-icons/fa';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileEdit = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationality: '',
      address: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    },
    
    // Employment Information (read-only for employees)
    employmentInfo: {
      employeeId: '',
      department: '',
      position: '',
      jobTitle: '',
      manager: '',
      workLocation: '',
      workEmail: '',
      workPhone: '',
      employmentType: '',
      employmentStatus: '',
      joinDate: '',
      noticePeriod: ''
    },
    
    // Skills
    skills: [],
    newSkill: '',
    
    // Education
    education: [],
    
    // Social Links
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: ''
    },
    
    // Profile Photo
    profilePhoto: null,
    profilePhotoPreview: null
  });

  // Initialize form data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockData = {
        personalInfo: {
          fullName: user?.name || 'John Doe',
          email: user?.email || 'john.doe@company.com',
          phone: '+1 (555) 123-4567',
          dateOfBirth: '1990-05-15',
          gender: 'Male',
          maritalStatus: 'Single',
          nationality: 'American',
          address: '123 Main Street, New York, NY 10001',
          emergencyContact: {
            name: 'Jane Smith',
            relationship: 'Sister',
            phone: '+1 (555) 987-6543'
          }
        },
        
        employmentInfo: {
          employeeId: user?.employeeId || 'EMP00123',
          department: user?.department || 'Engineering',
          position: 'Senior Software Engineer',
          jobTitle: 'Software Development Lead',
          manager: 'Sarah Johnson',
          workLocation: 'New York Office',
          workEmail: 'john.doe@company.com',
          workPhone: '+1 (555) 123-4567',
          employmentType: 'Full-time',
          employmentStatus: 'Active',
          joinDate: '2020-03-15',
          noticePeriod: '30 days'
        },
        
        skills: [
          { id: 1, name: 'JavaScript', level: 90 },
          { id: 2, name: 'React', level: 85 },
          { id: 3, name: 'Node.js', level: 80 },
          { id: 4, name: 'TypeScript', level: 75 },
          { id: 5, name: 'AWS', level: 70 }
        ],
        
        education: [
          { id: 1, degree: 'Master of Computer Science', institution: 'Stanford University', year: '2014-2016' },
          { id: 2, degree: 'Bachelor of Engineering', institution: 'MIT', year: '2010-2014' }
        ],
        
        socialLinks: {
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
          portfolio: 'https://johndoe.dev'
        }
      };
      
      setFormData({
        ...formData,
        ...mockData,
        newSkill: ''
      });
      setLoading(false);
    }, 1000);
  };

  // Handle form changes
  const handleChange = (section, field, value) => {
    setFormData(prev => {
      const updated = { ...prev };
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        updated[section][parent][child] = value;
      } else {
        updated[section][field] = value;
      }
      
      return updated;
    });
    
    setHasUnsavedChanges(true);
  };

  // Handle emergency contact changes
  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        emergencyContact: {
          ...prev.personalInfo.emergencyContact,
          [field]: value
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Handle social link changes
  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Handle skill operations
  const handleSkillAdd = () => {
    if (formData.newSkill.trim()) {
      const newSkill = {
        id: Date.now(),
        name: formData.newSkill.trim(),
        level: 50
      };
      
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
        newSkill: ''
      }));
      setHasUnsavedChanges(true);
    }
  };

  const handleSkillRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
    setHasUnsavedChanges(true);
  };

  const handleSkillLevelChange = (id, level) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, level } : skill
      )
    }));
    setHasUnsavedChanges(true);
  };

  // Handle education operations
  const handleEducationAdd = () => {
    const newEducation = {
      id: Date.now(),
      degree: '',
      institution: '',
      year: ''
    };
    
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
    setHasUnsavedChanges(true);
  };

  const handleEducationChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
    setHasUnsavedChanges(true);
  };

  const handleEducationRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
    setHasUnsavedChanges(true);
  };

  // Handle profile photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePhoto: file,
          profilePhotoPreview: reader.result
        }));
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoRemove = () => {
    setFormData(prev => ({
      ...prev,
      profilePhoto: null,
      profilePhotoPreview: null
    }));
    setHasUnsavedChanges(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setShowSuccessModal(true);
      setHasUnsavedChanges(false);
      console.log('Profile updated:', formData);
    }, 1500);
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelModal(true);
    } else {
      window.history.back();
    }
  };

  // Confirm cancel
  const confirmCancel = () => {
    setShowCancelModal(false);
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner 
          size="lg"
          type="ring"
          text="Loading profile data..."
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
            <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
            <p className="text-gray-600 mt-2">
              Update your personal and professional information
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !hasUnsavedChanges}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Photo & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Photo */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Photo</h3>
              
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                    {formData.profilePhotoPreview ? (
                      <img 
                        src={formData.profilePhotoPreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                        <FaUser className="text-indigo-600 text-6xl" />
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition cursor-pointer">
                    <FaCamera />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="flex justify-center space-x-3">
                  <label className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition cursor-pointer">
                    <FaUpload className="inline mr-2" />
                    Upload New
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.profilePhotoPreview && (
                    <button
                      type="button"
                      onClick={handlePhotoRemove}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      <FaTimes className="inline mr-2" />
                      Remove
                    </button>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-3">
                  Recommended: Square image, 400x400px, JPG or PNG
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.fullName}
                    onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaEnvelope className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaPhone className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaCalendarAlt className="inline mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.personalInfo.gender}
                    onChange={(e) => handleChange('personalInfo', 'gender', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marital Status
                  </label>
                  <select
                    value={formData.personalInfo.maritalStatus}
                    onChange={(e) => handleChange('personalInfo', 'maritalStatus', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.nationality}
                    onChange={(e) => handleChange('personalInfo', 'nationality', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Address
                  </label>
                  <textarea
                    value={formData.personalInfo.address}
                    onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.emergencyContact.name}
                    onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.emergencyContact.relationship}
                    onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.emergencyContact.phone}
                    onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                <FaGraduationCap className="text-gray-400" />
              </div>
              
              {/* Add Skill */}
              <div className="flex mb-6">
                <input
                  type="text"
                  value={formData.newSkill}
                  onChange={(e) => setFormData({...formData, newSkill: e.target.value})}
                  placeholder="Add a new skill"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={handleSkillAdd}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>
              
              {/* Skills List */}
              <div className="space-y-4">
                {formData.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => handleSkillLevelChange(skill.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                <button
                  type="button"
                  onClick={handleEducationAdd}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm"
                >
                  + Add Education
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.education.map((edu, index) => (
                  <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-800">Education #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleEducationRemove(edu.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Degree/Certificate
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year
                        </label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)}
                          placeholder="e.g., 2014-2016"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.education.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <FaGraduationCap className="text-gray-400 text-4xl mx-auto mb-3" />
                    <p className="text-gray-500">No education records added yet</p>
                    <button
                      type="button"
                      onClick={handleEducationAdd}
                      className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Add First Education Record
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.portfolio}
                    onChange={(e) => handleSocialLinkChange('portfolio', e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Profile Updated"
        type="success"
        showFooter
        onConfirm={() => window.history.back()}
        confirmText="Back to Profile"
      >
        <div className="text-center py-4">
          <FaSave className="text-green-500 text-4xl mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-800 mb-2">
            Your profile has been updated successfully!
          </p>
          <p className="text-gray-600">
            All changes have been saved to your profile.
          </p>
        </div>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Unsaved Changes"
        type="warning"
        showFooter
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelModal(false)}
        confirmText="Discard Changes"
        cancelText="Continue Editing"
      >
        <div className="py-4">
          <div className="flex items-start mb-4">
            <FaTimes className="text-yellow-500 text-2xl mr-3 mt-1" />
            <div>
              <p className="font-medium text-gray-800 mb-2">
                You have unsaved changes
              </p>
              <p className="text-gray-600">
                Are you sure you want to leave? Any unsaved changes will be lost.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileEdit;