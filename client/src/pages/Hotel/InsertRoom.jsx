import React, { useState } from 'react';
import RoomService from '../../api_service/RoomService';
import CloudinaryStorageService from '../../api_service/Cloudinaryservice';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const InsertRoom = ({ showModal, setShowModal, onRoomAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    maxOccupancy: '1',
    area: '',
    bedType: 'Single',
    numberOfBeds: '1',
    bathrooms: '1',
    amenities: '',
    status: 'available',
    imageFiles: [],
    imagePreviews: [],
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setError('');

    if (files.length === 0) return;

    try {
      // Validate all files
      files.forEach(file => {
        CloudinaryStorageService.validateFile(file);
      });

      // Create previews for all files
      const newPreviews = [];
      const newFiles = [];

      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          newFiles.push(file);
          
          // When all files are processed, update state
          if (newPreviews.length === files.length) {
            setFormData(prev => ({
              ...prev,
              imageFiles: [...prev.imageFiles, ...newFiles],
              imagePreviews: [...prev.imagePreviews, ...newPreviews]
            }));
          }
        };
        reader.onerror = () => {
          throw new Error('Failed to read file');
        };
        reader.readAsDataURL(file);
      });

    } catch (uploadError) {
      setError(uploadError.message);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveAllImages = () => {
    setFormData(prev => ({
      ...prev,
      imageFiles: [],
      imagePreviews: []
    }));
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const prepareRoomDataForAPI = async (serviceProviderId) => {
    let roomImageUrls = [];

    if (formData.imageFiles.length > 0) {
      try {
        setUploadProgress(`Uploading ${formData.imageFiles.length} image(s)...`);
        
        // Upload all images
        const uploadPromises = formData.imageFiles.map((file, index) => {
          const fileName = CloudinaryStorageService.generateFileName(
            file.name,
            serviceProviderId,
            index
          );
          return CloudinaryStorageService.uploadImage(file, fileName);
        });

        roomImageUrls = await Promise.all(uploadPromises);
        
        console.log('All images uploaded successfully:', roomImageUrls);
        setUploadProgress(`${roomImageUrls.length} image(s) uploaded successfully!`);
        
      } catch (uploadError) {
        console.error('Error uploading images to Cloudinary:', uploadError);
        setUploadProgress('');
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
    }

    // Process amenities - convert comma-separated string to array
    const amenitiesArray = formData.amenities
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a);

    // Prepare API data matching the DTO structure exactly
    const apiData = {
      serviceProviderId: parseInt(serviceProviderId),
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      maxOccupancy: parseInt(formData.maxOccupancy),
      area: parseInt(formData.area),
      bedType: formData.bedType,
      numberOfBeds: parseInt(formData.numberOfBeds),
      bathrooms: parseInt(formData.bathrooms),
      amenities: amenitiesArray,
      status: formData.status.toUpperCase(), // Convert to uppercase to match enum
      images: roomImageUrls, // Now contains multiple image URLs
    };

    console.log('API Data to be sent:', apiData);
    return apiData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploadProgress('');

    // Get service provider ID
    const serviceProvider = localStorage.getItem('serviceProvider');
    let serviceProviderId;

    try {
      const providerData = serviceProvider ? JSON.parse(serviceProvider) : null;
      serviceProviderId = providerData?.id;
      if (!serviceProviderId) {
        setError('Error: Service Provider ID not found. Please login again.');
        return;
      }
    } catch (parseError) {
      console.error('Error parsing service provider:', parseError);
      setError('Error reading user data. Please login again.');
      return;
    }

    // Validate form data
    if (!formData.name.trim()) {
      setError('Room Name is required.');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError('Valid Price is required.');
      return;
    }

    const area = parseInt(formData.area);
    if (isNaN(area) || area <= 0) {
      setError('Valid Area is required.');
      return;
    }

    if (formData.imageFiles.length === 0) {
      setError('Please upload at least one image for the room.');
      return;
    }

    setIsSubmitting(true);

    try {
      setUploadProgress('Preparing room data...');
      const apiData = await prepareRoomDataForAPI(serviceProviderId);
      
      setUploadProgress('Creating room...');
      const response = await RoomService.createRoom(apiData);
      
      console.log('Room created successfully:', response);
      setUploadProgress('Room created successfully! 🎉');

      // Callback to parent component
      if (onRoomAdded) {
        onRoomAdded(response);
      }

      // Success cleanup
      setTimeout(() => {
        resetForm();
        setShowModal(false);
      }, 1500);

    } catch (apiError) {
      console.error('Error creating room:', apiError);
      setError(apiError.message || 'Failed to add room. Please try again.');
      setUploadProgress('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      maxOccupancy: '1',
      area: '',
      bedType: 'Single',
      numberOfBeds: '1',
      bathrooms: '1',
      amenities: '',
      status: 'available',
      imageFiles: [],
      imagePreviews: [],
    });
    setError('');
    setUploadProgress('');
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      resetForm();
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Room</h2>
            <button
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 text-xl"
            >
              ✕
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                placeholder="Enter room name"
                disabled={isSubmitting}
              />
            </div>

            {/* Price and Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night (LKR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  placeholder="Enter price"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sqm) *
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  placeholder="Enter area"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Room Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Occupancy
                </label>
                <select
                  name="maxOccupancy"
                  value={formData.maxOccupancy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  disabled={isSubmitting}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bed Type
                </label>
                <select
                  name="bedType"
                  value={formData.bedType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  disabled={isSubmitting}
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Queen">Queen</option>
                  <option value="King">King</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Beds
                </label>
                <select
                  name="numberOfBeds"
                  value={formData.numberOfBeds}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  disabled={isSubmitting}
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Bathrooms
              </label>
              <select
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                disabled={isSubmitting}
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <textarea
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors resize-none"
                placeholder="Enter amenities separated by commas (e.g., Air conditioning, Free WiFi, TV)"
                disabled={isSubmitting}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                disabled={isSubmitting}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Room Images Upload - UPDATED FOR MULTIPLE IMAGES */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Images * ({formData.imageFiles.length} selected)
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  disabled={isSubmitting}
                  multiple // Enable multiple file selection
                  required={formData.imageFiles.length === 0}
                />
                <p className="text-xs text-gray-500">
                  Maximum file size: 10MB per image. Accepted formats: JPEG, PNG, WebP. You can select multiple images.
                </p>
                
                {/* Image Previews Grid */}
                {formData.imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-medium text-gray-700">
                        Selected Images ({formData.imagePreviews.length})
                      </p>
                      <button
                        type="button"
                        onClick={handleRemoveAllImages}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4" />
                        Remove All
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {formData.imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Room preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            disabled={isSubmitting}
                          >
                            ×
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#2953A6] hover:bg-[#1F74BF] text-white py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Add Room'
                )}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg transition-colors disabled:opacity-50 font-medium"
                disabled={isSubmitting}
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

export default InsertRoom;