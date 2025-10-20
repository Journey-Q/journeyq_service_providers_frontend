import React, { useState, useEffect } from 'react';
import TourPackageService from '../../api_service/TourPackageService';
import CloudinaryStorageService from '../../api_service/Cloudinaryservice';
import { AlertTriangle, Loader2, Check, X, Trash2 } from 'lucide-react';

const AddPastTourPhotos = ({ showModal, setShowModal, tour, onSavePhotos }) => {
  const [newPhotos, setNewPhotos] = useState([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [photosToRemove, setPhotosToRemove] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // Reset state when modal opens/closes or tour changes
  useEffect(() => {
    if (showModal && tour) {
      setExistingPhotos(tour.pastTourImages || []);
      setNewPhotos([]);
      setNewPhotoPreviews([]);
      setPhotosToRemove([]);
      setError('');
      setUploadProgress('');
    }
  }, [showModal, tour]);

  const handleNewPhotosUpload = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal = existingPhotos.length - photosToRemove.length + newPhotos.length;
    const remainingSlots = 7 - currentTotal;
    
    if (files.length === 0) return;

    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length === 0) {
      setError('Maximum 7 photos allowed');
      return;
    }

    setError('');

    try {
      // Validate all files before adding
      filesToAdd.forEach(file => {
        CloudinaryStorageService.validateFile(file);
      });

      const newPhotosList = [...newPhotos, ...filesToAdd];
      setNewPhotos(newPhotosList);

      // Create previews for new files
      const newPreviews = [];
      let processedCount = 0;

      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          processedCount++;
          
          // When all files are processed, update state
          if (processedCount === filesToAdd.length) {
            setNewPhotoPreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.onerror = () => {
          setError('Failed to read file. Please try again.');
        };
        reader.readAsDataURL(file);
      });

      if (files.length > filesToAdd.length) {
        setError(`Only ${filesToAdd.length} photos added. Maximum 7 photos allowed.`);
      }
    } catch (validationError) {
      setError(validationError.message);
      e.target.value = '';
    }
  };

  const removeNewPhoto = (index) => {
    const updatedPhotos = newPhotos.filter((_, i) => i !== index);
    const updatedPreviews = newPhotoPreviews.filter((_, i) => i !== index);
    setNewPhotos(updatedPhotos);
    setNewPhotoPreviews(updatedPreviews);
    setError('');
  };

  const toggleRemoveExistingPhoto = (photoId) => {
    if (photosToRemove.includes(photoId)) {
      setPhotosToRemove(photosToRemove.filter(id => id !== photoId));
    } else {
      setPhotosToRemove([...photosToRemove, photoId]);
    }
    setError('');
  };

  const handleSave = async () => {
    const currentTotal = existingPhotos.length - photosToRemove.length + newPhotos.length;
    
    if (currentTotal === 0) {
      setError('Tour must have at least one photo');
      return;
    }

    if (currentTotal > 7) {
      setError('Maximum 7 photos allowed');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get service provider ID from localStorage
      const serviceProvider = localStorage.getItem('serviceProvider');
      let serviceProviderId;

      try {
        const providerData = serviceProvider ? JSON.parse(serviceProvider) : null;
        serviceProviderId = providerData?.id;
        if (!serviceProviderId) {
          throw new Error('Service Provider ID not found. Please login again.');
        }
      } catch (parseError) {
        throw new Error('Error reading user data. Please login again.');
      }

      let uploadedUrls = [];
      
      // Upload new photos if any
      if (newPhotos.length > 0) {
        setUploadProgress(`Uploading ${newPhotos.length} photo(s) to Cloudinary...`);
        
        const uploadPromises = newPhotos.map((file, index) => {
          const fileName = CloudinaryStorageService.generateFileName(
            file.name,
            serviceProviderId,
            index
          );
          return CloudinaryStorageService.uploadImage(file, fileName);
        });

        uploadedUrls = await Promise.all(uploadPromises);
        console.log('Images uploaded successfully to Cloudinary:', uploadedUrls);
      }

      setUploadProgress('Updating tour package...');

      // Filter out photos marked for removal
      const remainingExistingPhotos = existingPhotos.filter(
        photo => !photosToRemove.includes(photo.id)
      );

      // Calculate the next orderIndex
      const maxOrderIndex = remainingExistingPhotos.length > 0 
        ? Math.max(...remainingExistingPhotos.map(img => img.orderIndex))
        : -1;

      // Create new image objects with proper structure
      const newImageObjects = uploadedUrls.map((url, index) => ({
        imageUrl: url,
        orderIndex: maxOrderIndex + 1 + index
      }));

      // Combine remaining existing and new images
      const allImages = [...remainingExistingPhotos, ...newImageObjects];

      // Get the current tour data from backend
      const response = await fetch(
        `${TourPackageService.BASE_URL}/${tour.id}`,
        {
          method: "GET",
          headers: TourPackageService.getAuthHeaders(),
        }
      );
      const currentTour = await TourPackageService.handleResponse(response);

      // Prepare update data with new pastTourImages
      const updateData = {
        ...currentTour,
        pastTourImages: allImages
      };

      // Update the tour with new images
      await TourPackageService.updateTourPackage(tour.id, updateData);
      
      console.log('Photos updated successfully');
      setUploadProgress('Photos saved successfully! 🎉');

      // Callback to parent component
      if (onSavePhotos) {
        onSavePhotos(tour.id, uploadedUrls);
      }

      // Success cleanup
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (uploadError) {
      console.error('Error saving photos:', uploadError);
      setError(uploadError.message || 'Failed to save photos. Please try again.');
      setUploadProgress('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNewPhotos([]);
      setNewPhotoPreviews([]);
      setExistingPhotos([]);
      setPhotosToRemove([]);
      setError('');
      setUploadProgress('');
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  // Calculate counts for display
  const remainingExistingCount = existingPhotos.length - photosToRemove.length;
  const totalAfterChanges = remainingExistingCount + newPhotos.length;
  const availableSlots = 7 - totalAfterChanges;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Manage Past Tour Photos
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {tour?.name}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
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
              {uploadProgress.includes('successfully') ? (
                <Check className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
              )}
              <p className="text-sm font-medium">{uploadProgress}</p>
            </div>
          )}

          {/* Summary Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm space-y-1">
              <p className="font-semibold text-gray-800">Photo Summary:</p>
              <p className="text-gray-700">
                • Existing: {existingPhotos.length} photo(s) 
                {photosToRemove.length > 0 && (
                  <span className="text-red-600"> ({photosToRemove.length} marked for removal)</span>
                )}
              </p>
              <p className="text-gray-700">• New to upload: {newPhotos.length} photo(s)</p>
              <p className="text-gray-700 font-semibold">
                • Total after save: {totalAfterChanges} / 7 photos
              </p>
              <p className="text-gray-700">• Available slots: {availableSlots}</p>
            </div>
          </div>

          {/* Existing Photos Section */}
          {existingPhotos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Existing Photos ({existingPhotos.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {existingPhotos.map((photo) => {
                  const isMarkedForRemoval = photosToRemove.includes(photo.id);
                  return (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.imageUrl}
                        alt={`Existing tour photo ${photo.orderIndex + 1}`}
                        className={`w-full h-32 object-cover rounded-lg border-2 transition-all ${
                          isMarkedForRemoval 
                            ? 'border-red-500 opacity-50' 
                            : 'border-gray-300'
                        }`}
                      />
                      <button
                        onClick={() => toggleRemoveExistingPhoto(photo.id)}
                        disabled={isSubmitting}
                        className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
                          isMarkedForRemoval
                            ? 'bg-green-500 text-white opacity-100'
                            : 'bg-red-500 text-white opacity-0 group-hover:opacity-100'
                        } disabled:opacity-0`}
                      >
                        {isMarkedForRemoval ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <div className={`absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded ${
                        isMarkedForRemoval ? 'bg-red-600' : 'bg-black/70'
                      }`}>
                        {isMarkedForRemoval ? 'Will Remove' : `#${photo.orderIndex + 1}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload New Photos Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Photos ({availableSlots} slots available)
            </label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleNewPhotosUpload}
              disabled={availableSlots === 0 || isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can select multiple images at once. Maximum file size: 10MB per image. Accepted formats: JPEG, PNG, WebP.
            </p>
          </div>

          {/* New Photo Previews */}
          {newPhotoPreviews.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                New Photos to Upload ({newPhotoPreviews.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {newPhotoPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`New tour photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-green-400"
                    />
                    <button
                      onClick={() => removeNewPhoto(index)}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      New {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || (newPhotos.length === 0 && photosToRemove.length === 0)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPastTourPhotos;