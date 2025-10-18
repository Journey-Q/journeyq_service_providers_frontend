import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import RoomService from '../../api_service/RoomService';
import CloudinaryStorageService from '../../api_service/Cloudinaryservice';

const EditRoom = ({ editModal, setEditModal, currentRoom, setCurrentRoom, onRoomUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    maxOccupancy: '1',
    area: '',
    bedType: 'Single',
    numberOfBeds: '1',
    bathrooms: '1',
    amenities: '',
    status: 'AVAILABLE',
    images: ''
  });

  // Image management states for edit modal
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editUploadProgress, setEditUploadProgress] = useState('');
  const [editError, setEditError] = useState('');

  // Get service provider ID from localStorage
  const serviceProvider = localStorage.getItem('serviceProvider');
  const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;

  // Initialize form data when currentRoom changes
  useEffect(() => {
    if (currentRoom && editModal) {
      // Parse bed configuration from "1 Queen bed" format
      const bedParts = currentRoom.beds.split(' ');
      const numberOfBeds = bedParts[0];
      const bedType = bedParts[1];
      
      setFormData({
        name: currentRoom.name,
        price: currentRoom.price.toString(),
        maxOccupancy: currentRoom.maxOccupancy.toString(),
        area: currentRoom.area.toString(),
        bedType: bedType,
        numberOfBeds: numberOfBeds,
        bathrooms: currentRoom.bathrooms.toString(),
        amenities: currentRoom.amenities.join(', '),
        status: currentRoom.status,
        images: ''
      });
      
      // Set existing images
      setExistingImages(currentRoom.images || []);
      setEditImageFiles([]);
      setEditImagePreviews([]);
      setImagesToDelete([]);
      setEditError('');
      setEditUploadProgress('');
    }
  }, [currentRoom, editModal]);

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
      status: 'AVAILABLE',
      images: ''
    });
    setEditImageFiles([]);
    setEditImagePreviews([]);
    setExistingImages([]);
    setImagesToDelete([]);
    setEditError('');
    setEditUploadProgress('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload in edit mode
  const handleEditImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setEditError('');

    if (files.length === 0) return;

    try {
      // Validate all files
      files.forEach(file => {
        CloudinaryStorageService.validateFile(file);
      });

      // Create previews for all files
      const newPreviews = [];
      const newFiles = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          newFiles.push(file);
          
          // When all files are processed, update state
          if (newPreviews.length === files.length) {
            setEditImageFiles(prev => [...prev, ...newFiles]);
            setEditImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.onerror = () => {
          throw new Error('Failed to read file');
        };
        reader.readAsDataURL(file);
      });

    } catch (uploadError) {
      setEditError(uploadError.message);
      e.target.value = '';
    }
  };

  // Remove existing image (mark for deletion)
  const handleRemoveExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setImagesToDelete(prev => [...prev, imageToRemove]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove newly uploaded image (before submit)
  const handleRemoveNewImage = (index) => {
    setEditImageFiles(prev => prev.filter((_, i) => i !== index));
    setEditImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Remove all existing images
  const handleRemoveAllExistingImages = () => {
    setImagesToDelete(prev => [...prev, ...existingImages]);
    setExistingImages([]);
  };

  // Remove all new images
  const handleRemoveAllNewImages = () => {
    setEditImageFiles([]);
    setEditImagePreviews([]);
    const fileInput = document.querySelector('#edit-image-input');
    if (fileInput) fileInput.value = '';
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditUploadProgress('');
    
    // Validate at least one image
    if (existingImages.length === 0 && editImageFiles.length === 0) {
      setEditError('Please keep at least one image or upload new images.');
      return;
    }

    setIsEditSubmitting(true);

    try {
      // Upload new images if any
      let newImageUrls = [];
      if (editImageFiles.length > 0) {
        setEditUploadProgress(`Uploading ${editImageFiles.length} new image(s)...`);
        
        const uploadPromises = editImageFiles.map((file, index) => {
          const fileName = CloudinaryStorageService.generateFileName(
            file.name,
            serviceProviderId,
            index
          );
          return CloudinaryStorageService.uploadImage(file, fileName);
        });

        newImageUrls = await Promise.all(uploadPromises);
        console.log('New images uploaded:', newImageUrls);
        setEditUploadProgress(`${newImageUrls.length} image(s) uploaded successfully!`);
      }

      // Combine existing images (not deleted) with new images
      const finalImages = [...existingImages, ...newImageUrls];

      // Prepare the data for API update
      const bedDescription = `${formData.numberOfBeds} ${formData.bedType} bed${formData.numberOfBeds > 1 ? 's' : ''}`;
      const amenitiesArray = formData.amenities.split(',').map(amenity => amenity.trim()).filter(amenity => amenity);
      
      const updatedRoomData = {
        name: formData.name,
        price: parseFloat(formData.price),
        maxOccupancy: parseInt(formData.maxOccupancy),
        area: parseInt(formData.area),
        beds: bedDescription,
        bathrooms: parseInt(formData.bathrooms),
        amenities: amenitiesArray,
        status: formData.status,
        images: finalImages
      };

      setEditUploadProgress('Updating room...');
      
      // Call API to update room
      await RoomService.editRoom(currentRoom.id, updatedRoomData);
      
      // Create updated room object
      const updatedRoom = {
        ...currentRoom,
        ...updatedRoomData,
        image: finalImages.length > 0 ? finalImages[0] : currentRoom.image
      };

      setEditUploadProgress('Room updated successfully! 🎉');
      
      // Call parent callback to update rooms list
      if (onRoomUpdated) {
        onRoomUpdated(updatedRoom);
      }
      
      setTimeout(() => {
        setEditModal(false);
        setCurrentRoom(null);
        resetForm();
      }, 1500);
      
    } catch (err) {
      console.error('Error updating room:', err);
      setEditError('Failed to update room: ' + err.message);
      setEditUploadProgress('');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleCloseEditModal = () => {
    if (!isEditSubmitting) {
      resetForm();
      setEditModal(false);
      setCurrentRoom(null);
    }
  };

  if (!editModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Room</h2>
            <button 
              onClick={handleCloseEditModal}
              disabled={isEditSubmitting}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Error Message */}
          {editError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{editError}</p>
            </div>
          )}

          {/* Progress Message */}
          {editUploadProgress && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                editUploadProgress.includes('successfully')
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-blue-100 border border-blue-400 text-blue-700'
              }`}
            >
              {!editUploadProgress.includes('successfully') && (
                <Loader2 className="w-5 h-5 mr-2 flex-shrink-0 animate-spin" />
              )}
              <p className="text-sm font-medium">{editUploadProgress}</p>
            </div>
          )}

          <form onSubmit={handleEditSubmit} className="space-y-6">
            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                placeholder="Enter room name"
                disabled={isEditSubmitting}
              />
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Details</h3>
              
              {/* Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night (LKR) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  placeholder="Enter price in LKR"
                  disabled={isEditSubmitting}
                />
              </div>

              {/* Maximum Occupancy */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Occupancy</label>
                <select
                  name="maxOccupancy"
                  value={formData.maxOccupancy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  disabled={isEditSubmitting}
                >
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                </select>
              </div>

              {/* Room Area */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Area (sqm) *</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  placeholder="Enter room area in square meters"
                  disabled={isEditSubmitting}
                />
              </div>
            </div>

            {/* Bed Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bed Type</label>
                <select
                  name="bedType"
                  value={formData.bedType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  disabled={isEditSubmitting}
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Queen">Queen</option>
                  <option value="King">King</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Beds</label>
                <select
                  name="numberOfBeds"
                  value={formData.numberOfBeds}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  disabled={isEditSubmitting}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Bathrooms</label>
              <select
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                disabled={isEditSubmitting}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <textarea
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors resize-none"
                placeholder="Enter amenities separated by commas (e.g., Air conditioning, Free WiFi, Minibar)"
                disabled={isEditSubmitting}
              />
            </div>

            {/* Room Images Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Images * (Total: {existingImages.length + editImageFiles.length})
              </label>
              
              {/* Existing Images Section */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Current Images ({existingImages.length})
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveAllExistingImages}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                      disabled={isEditSubmitting}
                    >
                      <X className="w-4 h-4" />
                      Remove All Current
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {existingImages.map((imageUrl, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Room image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border shadow-sm"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          disabled={isEditSubmitting}
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

              {/* New Images Section */}
              {editImagePreviews.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      New Images to Upload ({editImagePreviews.length})
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveAllNewImages}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                      disabled={isEditSubmitting}
                    >
                      <X className="w-4 h-4" />
                      Remove All New
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {editImagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={preview}
                          alt={`New room preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-blue-400 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          disabled={isEditSubmitting}
                        >
                          ×
                        </button>
                        <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                          New {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images Input */}
              <div className="space-y-2">
                <input
                  id="edit-image-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleEditImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                  disabled={isEditSubmitting}
                  multiple
                />
                <p className="text-xs text-gray-500">
                  Maximum file size: 10MB per image. Accepted formats: JPEG, PNG, WebP. You can select multiple images.
                </p>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent transition-colors"
                disabled={isEditSubmitting}
              >
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            {/* Form Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#2953A6] hover:bg-[#1F74BF] text-white py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                disabled={isEditSubmitting}
              >
                {isEditSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Update Room'
                )}
              </button>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg transition-colors disabled:opacity-50 font-medium"
                disabled={isEditSubmitting}
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

export default EditRoom;