import React, { useState } from 'react';

const EditDriver = ({ editModal, setEditModal, currentDriver, setCurrentDriver, drivers, setDrivers }) => {
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

  // Set form data when currentDriver changes
  React.useEffect(() => {
    if (currentDriver) {
      setFormData({
        name: currentDriver.name,
        experience: currentDriver.experience.toString(),
        languages: currentDriver.languages.join(', '),
        contactNumber: currentDriver.contactNumber,
        profilePhoto: currentDriver.profilePhoto,
        licenseNumber: currentDriver.licenseNumber,
        status: currentDriver.status
      });
      setImagePreview(currentDriver.profilePhoto);
      setImageFile(null);
    }
  }, [currentDriver]);

  return (
    <>
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
    </>
  );
};

export default EditDriver;