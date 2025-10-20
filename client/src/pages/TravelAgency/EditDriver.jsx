import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import TravelDriverService from '../../api_service/TravelDriverService';
import CloudinaryStorageService from '../../api_service/Cloudinaryservice';

const EditDriver = ({ editModal, setEditModal, currentDriver, setCurrentDriver, onDriverUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    languages: '',
    contactNumber: '',
    licenseNumber: '',
    status: 'available'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  // Get service provider ID from localStorage
  const serviceProvider = localStorage.getItem('serviceProvider');
  const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;

  // Set form data when currentDriver changes
  useEffect(() => {
    if (currentDriver && editModal) {
      setFormData({
        name: currentDriver.name,
        experience: currentDriver.experience.toString(),
        languages: currentDriver.languages.join(', '),
        contactNumber: currentDriver.contactNumber,
        licenseNumber: currentDriver.licenseNumber,
        status: currentDriver.status
      });
      setExistingImage(currentDriver.profilePhoto);
      setImagePreview('');
      setImageFile(null);
      setError('');
      setUploadProgress('');
    }
  }, [currentDriver, editModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    try {
      CloudinaryStorageService.validateFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageFile(file);
        setImagePreview(e.target.result);
      };
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch (uploadError) {
      setError(uploadError.message);
      e.target.value = '';
    }
  };

  const handleRemoveNewImage = () => {
    setImageFile(null);
    setImagePreview('');
    const fileInput = document.querySelector('#edit-driver-image-input');
    if (fileInput) fileInput.value = '';
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploadProgress('');

    if (!serviceProviderId) {
      setError('Error: Service Provider ID not found. Please login again.');
      return;
    }

    if (!formData.name.trim()) {
      setError('Driver Name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      let profilePhotoUrl = existingImage;

      // Upload new image to Cloudinary if provided
      if (imageFile) {
        try {
          setUploadProgress('Uploading new profile photo...');
          
          const fileName = CloudinaryStorageService.generateFileName(
            imageFile.name,
            serviceProviderId,
            currentDriver.id
          );
          profilePhotoUrl = await CloudinaryStorageService.uploadImage(imageFile, fileName);
          
          console.log('Image uploaded successfully:', profilePhotoUrl);
          setUploadProgress('Image uploaded successfully!');
          
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          setUploadProgress('');
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }

      // Prepare driver data
      const languagesArray = formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang);
      
      // Map frontend status to backend status
      const statusMap = {
        'available': 'AVAILABLE',
        'on leave': 'ON_LEAVE',
        'training': 'TRAINING',
        'unavailable': 'UNAVAILABLE'
      };
      
      const updatedDriverData = {
        serviceProviderId: parseInt(serviceProviderId),
        name: formData.name.trim(),
        experience: parseInt(formData.experience),
        languages: languagesArray,
        contactNumber: formData.contactNumber.trim(),
        profilePhoto: profilePhotoUrl,
        licenseNumber: formData.licenseNumber.trim(),
        status: statusMap[formData.status] || 'AVAILABLE'
      };

      console.log('Driver data to be sent:', updatedDriverData);

      setUploadProgress('Updating driver profile...');
      await TravelDriverService.editDriver(currentDriver.id, updatedDriverData);
      
      // Create the updated driver object with proper frontend format
      const updatedDriver = {
        ...currentDriver,
        name: formData.name.trim(),
        experience: parseInt(formData.experience),
        languages: languagesArray,
        contactNumber: formData.contactNumber.trim(),
        profilePhoto: profilePhotoUrl,
        licenseNumber: formData.licenseNumber.trim(),
        status: formData.status
      };

      // Call the onDriverUpdate callback to update the parent component
      if (onDriverUpdate) {
        onDriverUpdate(updatedDriver);
      }
      
      console.log('Driver updated successfully');
      setUploadProgress('Driver updated successfully! 🎉');

      setTimeout(() => {
        setEditModal(false);
        setCurrentDriver(null);
        resetForm();
      }, 1500);

    } catch (err) {
      console.error("Error updating driver:", err);
      setError(err.message || "Failed to update driver. Please try again.");
      setUploadProgress('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      experience: '',
      languages: '',
      contactNumber: '',
      licenseNumber: '',
      status: 'available'
    });
    setImageFile(null);
    setImagePreview('');
    setExistingImage('');
    setError('');
    setUploadProgress('');
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      resetForm();
      setEditModal(false);
      setCurrentDriver(null);
    }
  };

  if (!editModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Driver</h2>
            <button 
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Progress Message */}
          {uploadProgress && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                uploadProgress.includes('successfully')
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-blue-100 border border-blue-400 text-blue-700'
              }`}
            >
              {!uploadProgress.includes('successfully') && (
                <Loader2 className="w-5 h-5 mr-2 flex-shrink-0 animate-spin" />
              )}
              <p className="text-sm font-medium">{uploadProgress}</p>
            </div>
          )}

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
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
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
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
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
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
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
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
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
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
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
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
                >
                  <option value="available">Available</option>
                  <option value="on leave">On Leave</option>
                  <option value="training">In Training</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            {/* Profile Photo Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              
              {/* Current Image Section */}
              {existingImage && !imagePreview && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Photo</p>
                  <img 
                    src={existingImage} 
                    alt="Current profile" 
                    className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                    onError={(e) => {
                      e.target.src = "https://randomuser.me/api/portraits/men/1.jpg";
                    }}
                  />
                </div>
              )}

              {/* New Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">New Photo Preview</p>
                    <button
                      type="button"
                      onClick={handleRemoveNewImage}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                      Remove New Photo
                    </button>
                  </div>
                  <img 
                    src={imagePreview} 
                    alt="New profile preview" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-blue-400 shadow-sm"
                  />
                </div>
              )}

              {/* Upload New Photo Input */}
              <div className="space-y-2">
                <input
                  id="edit-driver-image-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
                />
                <p className="text-xs text-gray-500">
                  Maximum file size: 10MB. Accepted formats: JPEG, PNG, WebP. Leave empty to keep current photo.
                </p>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Update Driver'
                )}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDriver;