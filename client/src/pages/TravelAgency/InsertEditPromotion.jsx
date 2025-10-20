import React, { useState, useRef, useEffect } from 'react';
import { Upload, Calendar, Clock, X, AlertTriangle, Loader2 } from 'lucide-react';
import PromotionService from '../../api_service/PromotionService';
import CloudinaryStorageService from '../../api_service/Cloudinaryservice';

const InsertEditPromotion = ({ showModal, closeModal, handleSubmit, onPromotionAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    discount: '',
    validFrom: '',
    validTo: '',
    isActive: true
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize form when modal opens
  useEffect(() => {
    if (showModal) {
      setFormData({
        title: '',
        description: '',
        image: '',
        discount: '',
        validFrom: '',
        validTo: '',
        isActive: true
      });
      setImageFile(null);
      setError('');
      setUploadProgress('');
    }
  }, [showModal]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setError('');
    
    if (!file) return;

    try {
      CloudinaryStorageService.validateFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.result }));
        setImageFile(file);
      };
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch (uploadError) {
      setError(uploadError.message);
      event.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const preparePromotionDataForAPI = async (serviceProviderId) => {
    let promotionImageUrl = formData.image;

    // Upload new image if a file was selected
    if (imageFile) {
      try {
        setUploadProgress('Uploading image...');
        
        const fileName = CloudinaryStorageService.generateFileName(
          imageFile.name,
          serviceProviderId,
          0
        );
        promotionImageUrl = await CloudinaryStorageService.uploadImage(imageFile, fileName);
        
        console.log('Image uploaded successfully:', promotionImageUrl);
        setUploadProgress('Image uploaded successfully!');
        
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        setUploadProgress('');
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
    }

    // Prepare API data matching the backend structure
    const apiData = {
      serviceProviderId: parseInt(serviceProviderId),
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: promotionImageUrl,
      discount: parseFloat(formData.discount),
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      isActive: formData.isActive
    };

    console.log('API Data to be sent:', apiData);
    return apiData;
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Promotion title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Promotion description is required');
      return false;
    }
    if (!formData.discount || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100) {
      setError('Discount must be between 0 and 100');
      return false;
    }
    if (!formData.validFrom) {
      setError('Valid from date is required');
      return false;
    }
    if (!formData.validTo) {
      setError('Valid to date is required');
      return false;
    }
    if (new Date(formData.validFrom) >= new Date(formData.validTo)) {
      setError('Valid to date must be after valid from date');
      return false;
    }
    if (!imageFile) {
      setError('Please upload an image for the promotion');
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    setError('');
    setUploadProgress('');

    if (!validateForm()) {
      return;
    }

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

    setIsSubmitting(true);

    try {
      setUploadProgress('Preparing promotion data...');
      const apiData = await preparePromotionDataForAPI(serviceProviderId);
      
      setUploadProgress('Creating promotion...');
      
      const response = await PromotionService.createPromotion(apiData);
      if (onPromotionAdded) {
        onPromotionAdded(response);
      }
      
      console.log('Promotion created successfully:', response);
      setUploadProgress('Promotion created successfully! 🎉');

      setTimeout(() => {
        closeModal();
      }, 1500);

    } catch (apiError) {
      console.error('Error creating promotion:', apiError);
      setError(apiError.message || 'Failed to create promotion. Please try again.');
      setUploadProgress('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Promotion
            </h2>
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none disabled:opacity-50"
              placeholder="Enter promotion title"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none resize-none disabled:opacity-50"
              placeholder="Describe your promotion"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promotion Image *
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#0088cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
            >
              {formData.image ? (
                <div className="relative">
                  <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                  {!isSubmitting && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-500 mt-2">
                Maximum file size: 10MB. Accepted formats: JPEG, PNG, WebP.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isSubmitting}
            />
          </div>

          {/* Discount & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => handleInputChange('discount', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none disabled:opacity-50"
                placeholder="0"
                min="0"
                max="100"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange('validFrom', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none disabled:opacity-50"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid To</label>
              <input
                type="date"
                value={formData.validTo}
                onChange={(e) => handleInputChange('validTo', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none disabled:opacity-50"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="w-4 h-4 text-[#0088cc] border-gray-300 rounded focus:ring-[#0088cc] disabled:opacity-50"
              disabled={isSubmitting}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Make promotion active immediately (after approval)
            </label>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Admin Approval Required</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Your promotion will be submitted for admin approval. You'll be able to manage it once approved.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077bb] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit for Approval'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertEditPromotion;