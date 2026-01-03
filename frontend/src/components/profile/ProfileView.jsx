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
  FaEdit,
  FaDownload,
  FaPrint,
  FaCamera,
  FaLinkedin,
  FaGithub,
  FaGlobe
} from 'react-icons/fa';
import Modal from '../common/Modal';

const ProfileView = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Mock profile data
  useEffect(() => {
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
            probationEndDate: '2020-09-15',
            noticePeriod: '30 days'
          },
          
          salaryInfo: {
            basicSalary: 85000,
            houseRentAllowance: 17000,
            medicalAllowance: 5000,
            conveyanceAllowance: 3000,
            specialAllowance: 12000,
            totalCTC: 122000,
            bankName: 'City Bank',
            accountNumber: 'XXXX-XXXX-1234',
            accountType: 'Savings',
            taxId: '123-45-6789',
            paymentMethod: 'Bank Transfer',
            paySchedule: 'Monthly',
            lastIncrement: '2023-06-01',
            incrementPercentage: 12
          },
          
          documents: [
            { id: 1, name: 'Resume', type: 'pdf', uploaded: '2023-01-15', size: '2.4 MB' },
            { id: 2, name: 'Degree Certificate', type: 'pdf', uploaded: '2023-01-15', size: '3.1 MB' },
            { id: 3, name: 'ID Proof', type: 'jpg', uploaded: '2023-01-10', size: '1.8 MB' },
            { id: 4, name: 'Address Proof', type: 'pdf', uploaded: '2023-01-10', size: '2.2 MB' },
            { id: 5, name: 'Experience Letter', type: 'pdf', uploaded: '2022-12-20', size: '1.5 MB' },
            { id: 6, name: 'Offer Letter', type: 'pdf', uploaded: '2020-03-10', size: '1.9 MB' }
          ],
          
          skills: [
            { name: 'JavaScript', level: 90 },
            { name: 'React', level: 85 },
            { name: 'Node.js', level: 80 },
            { name: 'TypeScript', level: 75 },
            { name: 'AWS', level: 70 },
            { name: 'MongoDB', level: 80 }
          ],
          
          education: [
            { degree: 'Master of Computer Science', institution: 'Stanford University', year: '2014-2016' },
            { degree: 'Bachelor of Engineering', institution: 'MIT', year: '2010-2014' }
          ],
          
          certifications: [
            { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', year: '2022' },
            { name: 'React Professional', issuer: 'Meta', year: '2021' },
            { name: 'Scrum Master', issuer: 'Scrum Alliance', year: '2020' }
          ],
          
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            github: 'https://github.com/johndoe',
            portfolio: 'https://johndoe.dev'
          },
          
          performance: {
            rating: 4.5,
            lastReview: '2023-12-15',
            nextReview: '2024-06-15',
            promotions: 2,
            awards: 3
          }
        };
        
        setProfileData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchProfileData();
  }, [user]);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleDownloadDocument = (document) => {
    alert(`Downloading ${document.name}...`);
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-2">
              View and manage your personal and professional information
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={handleEditProfile}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center">
              <FaPrint className="mr-2" />
              Print Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6">
            {/* Profile Photo */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-indigo-100 rounded-full mx-auto overflow-hidden border-4 border-white shadow-lg">
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="text-indigo-600 text-5xl" />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition">
                  <FaCamera />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {profileData?.personalInfo.fullName}
              </h2>
              <p className="text-gray-600">{profileData?.employmentInfo.position}</p>
              <p className="text-sm text-gray-500 mt-1">
                {profileData?.employmentInfo.department}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{profileData?.personalInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{profileData?.personalInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{profileData?.employmentInfo.workLocation}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaIdCard className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="font-medium">{profileData?.employmentInfo.employeeId}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Social Links</h4>
              <div className="flex space-x-3">
                <a
                  href={profileData?.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  title="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={profileData?.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                  title="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href={profileData?.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                  title="Portfolio"
                >
                  <FaGlobe />
                </a>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Performance</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{profileData?.performance.rating}</div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{profileData?.performance.promotions}</div>
                  <div className="text-xs text-gray-600">Promotions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{profileData?.performance.awards}</div>
                  <div className="text-xs text-gray-600">Awards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Date(profileData?.performance.nextReview).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-xs text-gray-600">Next Review</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              <FaUser className="text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">{profileData?.personalInfo.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{profileData?.personalInfo.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Marital Status</p>
                <p className="font-medium">{profileData?.personalInfo.maritalStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nationality</p>
                <p className="font-medium">{profileData?.personalInfo.nationality}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{profileData?.personalInfo.address}</p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-800 mb-3">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{profileData?.personalInfo.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Relationship</p>
                  <p className="font-medium">{profileData?.personalInfo.emergencyContact.relationship}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{profileData?.personalInfo.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Employment Information</h3>
              <FaBuilding className="text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Job Title</p>
                <p className="font-medium">{profileData?.employmentInfo.jobTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Manager</p>
                <p className="font-medium">{profileData?.employmentInfo.manager}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employment Type</p>
                <p className="font-medium">{profileData?.employmentInfo.employmentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employment Status</p>
                <p className="font-medium">{profileData?.employmentInfo.employmentStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Joining Date</p>
                <p className="font-medium">{profileData?.employmentInfo.joinDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Notice Period</p>
                <p className="font-medium">{profileData?.employmentInfo.noticePeriod}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
              <FaGraduationCap className="text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {profileData?.skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Documents</h3>
              <FaCertificate className="text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileData?.documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{doc.name}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      .{doc.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Uploaded: {doc.uploaded} • {doc.size}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        size="lg"
      >
        <div className="text-center py-8">
          <FaEdit className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Profile editing feature is under development</p>
          <p className="text-sm text-gray-500 mt-2">
            This feature will be available in the next update
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileView;