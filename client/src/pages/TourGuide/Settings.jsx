import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTourGuide'; // adjust if your component is named differently
import {
  Edit2, Save, X, User, Mail, Phone, MapPin, Globe, Briefcase,
  Shield, Trash2, AlertTriangle, Lock, Cog
} from 'lucide-react';

const Settings = () => {
  const [companyData, setCompanyData] = useState({
    companyName: 'Island Explore Tours',
    email: 'info@islandexplore.com',
    phone: '+94 77 987 6543',
    address: '123 Galle Road, Colombo, Sri Lanka',
    website: 'www.islandexplore.com',
    description: 'We provide curated travel experiences and professional tour guides across Sri Lanka.',
    numberOfGuides: 20,
    operatingSince: '2012'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    setIsEditing(false);
    alert('Tour guide company profile updated.');
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
        <div className="max-w-4xl mx-auto">

          {/* Company Profile */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-sky-100 p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Company Profile</h2>
                  <p className="text-gray-600">Manage your company information</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  isEditing ? 'bg-gray-200 text-gray-700' : 'bg-sky-600 text-white'
                }`}
              >
                {isEditing ? <><X className="w-4 h-4" /><span>Cancel</span></> : <><Edit2 className="w-4 h-4" /><span>Edit</span></>}
              </button>
            </div>

            <div className="p-6 space-y-6">
              {isEditing ? (
                <>
                  <Input label="Company Name" value={companyData.companyName} onChange={val => handleChange('companyName', val)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Email" value={companyData.email} onChange={val => handleChange('email', val)} />
                    <Input label="Phone" value={companyData.phone} onChange={val => handleChange('phone', val)} />
                  </div>
                  <Input label="Address" value={companyData.address} onChange={val => handleChange('address', val)} />
                  <Input label="Website" value={companyData.website} onChange={val => handleChange('website', val)} />
                  <Input label="Operating Since" value={companyData.operatingSince} onChange={val => handleChange('operatingSince', val)} />
                  <Input label="Number of Guides" type="number" value={companyData.numberOfGuides} onChange={val => handleChange('numberOfGuides', val)} />
                  <TextArea label="Description" value={companyData.description} onChange={val => handleChange('description', val)} />
                  <div className="flex justify-end">
                    <button onClick={saveChanges} className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition">
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Display label="Company Name" value={companyData.companyName} icon={<User className="w-5 h-5 text-sky-600" />} />
                  <Display label="Email" value={companyData.email} icon={<Mail className="w-5 h-5 text-sky-600" />} />
                  <Display label="Phone" value={companyData.phone} icon={<Phone className="w-5 h-5 text-sky-600" />} />
                  <Display label="Address" value={companyData.address} icon={<MapPin className="w-5 h-5 text-sky-600" />} />
                  <Display label="Website" value={companyData.website} icon={<Globe className="w-5 h-5 text-sky-600" />} />
                  {/* <Display label="Operating Since" value={companyData.operatingSince} icon={<Calendar className="w-5 h-5 text-sky-600" />} /> */}
                  <Display label="Number of Guides" value={companyData.numberOfGuides} icon={<User className="w-5 h-5 text-sky-600" />} />
                  <Display label="Description" value={companyData.description} />
                </>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-100">
            <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Security</h2>
                <p className="text-gray-600">Manage your login and authentication</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-sky-600" />
                  <span className="text-gray-800 font-medium">Change Password</span>
                </div>
                <Edit2 className="w-4 h-4 text-gray-400" />
              </button>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cog className="w-5 h-5 text-sky-600" />
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
                <p className="text-red-600">Account deletion is irreversible</p>
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

          {/* Optional: Password Modal */}
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
                    }} className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">
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

// Reusable components
const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-sky-500"
    />
  </div>
);

const TextArea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-sky-500"
      rows={3}
    />
  </div>
);

const Display = ({ label, value, icon = null }) => (
  <div className="flex items-start space-x-3">
    {icon && icon}
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default Settings;
