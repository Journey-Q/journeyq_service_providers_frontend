import React, { useState } from 'react';
import Sidebar from '../../components/SidebarTravelAgency';
import { FaUser, FaPhone, FaLanguage, FaStar, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Drivers = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Ravi Perera",
      experience: 5,
      languages: ["Sinhala", "English"],
      contactNumber: "+94 77 123 4567",
      profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.5,
      licenseNumber: "DL-12345678",
      status: "available"
    },
    {
      id: 2,
      name: "Kamal Silva",
      experience: 8,
      languages: ["Sinhala", "English", "Tamil"],
      contactNumber: "+94 76 234 5678",
      profilePhoto: "https://randomuser.me/api/portraits/men/44.jpg",
      rating: 4.8,
      licenseNumber: "DL-23456789",
      status: "available"
    },
    {
      id: 3,
      name: "Nimal Fernando",
      experience: 3,
      languages: ["Sinhala", "English"],
      contactNumber: "+94 71 345 6789",
      profilePhoto: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 4.2,
      licenseNumber: "DL-34567890",
      status: "on leave"
    },
    {
      id: 4,
      name: "Sunil Bandara",
      experience: 10,
      languages: ["Sinhala", "English", "Hindi"],
      contactNumber: "+94 78 456 7890",
      profilePhoto: "https://randomuser.me/api/portraits/men/89.jpg",
      rating: 4.9,
      licenseNumber: "DL-45678901",
      status: "available"
    },
    {
      id: 5,
      name: "Anil Jayasuriya",
      experience: 2,
      languages: ["Sinhala"],
      contactNumber: "+94 75 567 8901",
      profilePhoto: "https://randomuser.me/api/portraits/men/12.jpg",
      rating: 3.9,
      licenseNumber: "DL-56789012",
      status: "training"
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    languages: '',
    contactNumber: '',
    profilePhoto: '',
    licenseNumber: '',
    status: 'available'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const statusColors = {
    available: "bg-green-100 text-green-800",
    "on leave": "bg-yellow-100 text-yellow-800",
    training: "bg-sky-100 text-sky-800",
    unavailable: "bg-red-100 text-red-800"
  };

  const statusLabels = {
    available: "Available",
    "on leave": "On Leave",
    training: "In Training",
    unavailable: "Unavailable"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const languagesArray = formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang);
    
    const newDriver = {
      id: drivers.length + 1,
      name: formData.name,
      experience: parseInt(formData.experience),
      languages: languagesArray,
      contactNumber: formData.contactNumber,
      profilePhoto: imagePreview || "https://randomuser.me/api/portraits/men/1.jpg",
      licenseNumber: formData.licenseNumber,
      status: formData.status,
      rating: 0 // New drivers start with 0 rating
    };

    setDrivers(prev => [...prev, newDriver]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      experience: '',
      languages: '',
      contactNumber: '',
      profilePhoto: '',
      licenseNumber: '',
      status: 'available'
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (driver) => {
    setCurrentDriver(driver);
    setFormData({
      name: driver.name,
      experience: driver.experience.toString(),
      languages: driver.languages.join(', '),
      contactNumber: driver.contactNumber,
      profilePhoto: driver.profilePhoto,
      licenseNumber: driver.licenseNumber,
      status: driver.status
    });
    setImagePreview(driver.profilePhoto);
    setImageFile(null);
    setEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    const languagesArray = formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang);
    
    const updatedDriver = {
      ...currentDriver,
      name: formData.name,
      experience: parseInt(formData.experience),
      languages: languagesArray,
      contactNumber: formData.contactNumber,
      profilePhoto: imagePreview || currentDriver.profilePhoto,
      licenseNumber: formData.licenseNumber,
      status: formData.status
    };

    setDrivers(prev => prev.map(driver => driver.id === currentDriver.id ? updatedDriver : driver));
    setEditModal(false);
    setCurrentDriver(null);
    resetForm();
  };

  const handleDeleteClick = (driver) => {
    setCurrentDriver(driver);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    setDrivers(prev => prev.filter(driver => driver.id !== currentDriver.id));
    setDeleteModal(false);
    setCurrentDriver(null);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        {/* Header and Add Button */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search and Filters */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Drivers</label>
              <input
                type="text"
                placeholder="Search by name or license..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="on leave">On Leave</option>
                <option value="training">In Training</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            {/* Add Driver Button */}
            <div className="w-full md:w-auto flex items-end">
              <button 
                onClick={() => setShowModal(true)}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <FaPlus /> Add Driver
              </button>
            </div>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Driver</th>
                  <th className="px-6 py-4 text-left font-medium">Experience</th>
                  <th className="px-6 py-4 text-left font-medium">Languages</th>
                  <th className="px-6 py-4 text-left font-medium">Contact</th>
                  {/* <th className="px-6 py-4 text-left font-medium">Rating</th> */}
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={driver.profilePhoto} 
                          alt={driver.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{driver.name}</div>
                          <div className="text-xs text-gray-500">{driver.licenseNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {driver.experience} years
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {driver.languages.map((lang, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="mr-2 text-gray-500" />
                        {driver.contactNumber}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center">
                        {renderStars(driver.rating)}
                        <span className="ml-2 text-sm text-gray-600">{driver.rating.toFixed(1)}</span>
                      </div>
                    </td> */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[driver.status]}`}>
                        {statusLabels[driver.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleEdit(driver)}
                          className="text-sky-600 hover:text-sky-800 font-medium text-sm flex items-center"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(driver)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex justify-between items-center">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{drivers.length}</span> of <span className="font-medium">{drivers.length}</span> drivers
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">
                Previous
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Add Driver Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Add New Driver</h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Driver Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="e.g., Ravi Perera"
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)*</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="e.g., 5"
                      />
                    </div>

                    {/* Languages */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Languages*</label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Comma separated (e.g., Sinhala, English, Tamil)"
                      />
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number*</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="e.g., +94 77 123 4567"
                      />
                    </div>

                    {/* License Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number*</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="e.g., DL-12345678"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status*</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="available">Available</option>
                        <option value="on leave">On Leave</option>
                        <option value="training">In Training</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Add Driver
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Driver Modal */}
        {editModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Driver</h2>
                  <button 
                    onClick={() => setEditModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Driver Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)*</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>

                    {/* Languages */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Languages*</label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number*</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>

                    {/* License Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number*</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status*</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="available">Available</option>
                        <option value="on leave">On Leave</option>
                        <option value="training">In Training</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Update Driver
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete Driver</h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete "<span className="font-semibold">{currentDriver?.name}</span>"? This action cannot be undone.
                </p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Drivers;