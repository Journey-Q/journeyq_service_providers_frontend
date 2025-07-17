import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTourGuide';
import {
  Edit2,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Trash2,
  AlertTriangle,
  Lock,
  Cog,
  Star,
  Calendar,
  Camera
} from 'lucide-react';

const Settings = () => {
  const [agencyData, setAgencyData] = useState({
    agencyName: 'WanderWays Travel',
    email: 'contact@wanderways.com',
    phone: '+94 76 123 4567',
    address: '45 Paradise Lane, Kandy, Sri Lanka',
    description: 'We specialize in guided tours, vehicle rentals, and custom holiday packages across Sri Lanka.',
    establishedYear: '2015',
    fleetSize: 12,
    rating: 4.7
  });

  const [profileImage] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa572shfjq3PnLZV5ranb41L3_xadyL-eqQw&s');

  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleChange = (field, value) => {
    setAgencyData(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    setIsEditing(false);
    alert('Company profile updated.');
  };

  const handleDelete = () => {
    if (deleteConfirmation === 'DELETE') {
      alert('Company account deletion initiated.');
      setShowDeleteSection(false);
      setDeleteConfirmation('');
    } else {
      alert('Please type "DELETE" to confirm.');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Company Profile */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Tour Guide Agency Profile</h2>
                  <p className="text-gray-600">Manage your tour guide agency info</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  isEditing ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white'
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-6 space-y-6">
              {isEditing ? (
                <>
                  {/* Profile Image */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img 
                        src={profileImage} 
                        alt="Agency" 
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md transform translate-x-1 translate-y-1 hover:bg-blue-700">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Agency Logo</p>
                      <button className="text-blue-600 text-sm font-medium">Change Image</button>
                    </div>
                  </div>

                  <Input label="Agency Name" value={agencyData.agencyName} onChange={val => handleChange('agencyName', val)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Email" value={agencyData.email} onChange={val => handleChange('email', val)} />
                    <Input label="Phone" value={agencyData.phone} onChange={val => handleChange('phone', val)} />
                  </div>
                  <Input label="Address" value={agencyData.address} onChange={val => handleChange('address', val)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Established Year" value={agencyData.establishedYear} onChange={val => handleChange('establishedYear', val)} />
                    <Input label="Number of Tour Guides" value={agencyData.fleetSize} onChange={val => handleChange('fleetSize', val)} type="number" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Rating</label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(agencyData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-2 text-gray-700">{agencyData.rating}</span>
                    </div>
                  </div>
                  <TextArea label="Description" value={agencyData.description} onChange={val => handleChange('description', val)} />
                  <div className="flex justify-end">
                    <button
                      onClick={saveChanges}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column - Image */}
                    <div className="md:w-1/3">
                      <div className="relative">
                        <img 
                          src={profileImage} 
                          alt="Agency" 
                          className="w-full h-48 md:h-64 rounded-lg object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                          <h3 className="text-white font-bold text-lg">{agencyData.agencyName}</h3>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(agencyData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-white text-sm ml-1">{agencyData.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Details */}
                    <div className="md:w-2/3 space-y-4">
                      <Display label="Email" value={agencyData.email} />
                      <Display label="Phone" value={agencyData.phone} />
                      <Display label="Address" value={agencyData.address} />
                      <Display label="Established Year" value={agencyData.establishedYear} icon={<Calendar className="w-4 h-4 text-blue-600" />} />
                      <Display label="Number of Tour Guides" value={agencyData.fleetSize} />
                      <Display label="Description" value={agencyData.description} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Security</h2>
                <p className="text-gray-600">Update your password and view security status</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-800 font-medium">Change Password</span>
                </div>
                <Edit2 className="w-4 h-4 text-gray-400" />
              </button>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cog className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-800 font-medium">Account is Active</span>
                </div>
                <span className="text-sm text-green-800 bg-green-100 px-3 py-1 rounded-full">Active</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-md border border-red-200">
            <div className="p-6 border-b border-red-200 flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
                <p className="text-red-600">Delete your account permanently</p>
              </div>
            </div>
            <div className="p-6">
              {!showDeleteSection ? (
                <button
                  onClick={() => setShowDeleteSection(true)}
                  className="w-full p-4 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5 mr-2" /> Delete Account
                </button>
              ) : (
                <>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-red-700">
                      This action is permanent. Type <strong>DELETE</strong> to confirm.
                    </p>
                    <input
                      type="text"
                      className="w-full mt-2 px-3 py-2 border border-red-300 rounded-lg focus:outline-none"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="Type DELETE here"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowDeleteSection(false);
                        setDeleteConfirmation('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteConfirmation !== 'DELETE'}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        deleteConfirmation === 'DELETE'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Password Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Change Password</h2>
                  <button onClick={() => setShowPasswordModal(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm New Password" type="password" />
                  <div className="flex justify-end space-x-2 pt-3">
                    <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 border rounded-lg">
                      Cancel
                    </button>
                    <button onClick={() => {
                      alert('Password updated successfully!');
                      setShowPasswordModal(false);
                    }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Reusable input components
const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-500"
    />
  </div>
);

const TextArea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-blue-500"
      rows={3}
    />
  </div>
);

const Display = ({ label, value, icon }) => (
  <div>
    <p className="text-sm text-gray-600 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </p>
    <p className="font-medium text-gray-800 mt-1">{value}</p>
  </div>
);

export default Settings;