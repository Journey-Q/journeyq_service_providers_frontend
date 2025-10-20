import React, { useState, useEffect } from 'react';
import TravelVehicleService from '../../api_service/TravelVehicleService';
import CloudinaryStorageService from '../../api_service/Cloudinaryservice';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const EditVehicle = ({ vehicle, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Van',
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    ac: true,
    numberOfSeats: '',
    pricePerKmWithAC: '',
    pricePerKmWithoutAC: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    features: '',
    status: 'available',
    currentImageUrl: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        type: vehicle.type || 'Van',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year?.toString() || '',
        licensePlate: vehicle.licensePlate || '',
        ac: vehicle.ac ?? true,
        numberOfSeats: vehicle.numberOfSeats?.toString() || '',
        pricePerKmWithAC: vehicle.pricePerKmWithAC?.toString() || '',
        pricePerKmWithoutAC: vehicle.pricePerKmWithoutAC?.toString() || '',
        fuelType: vehicle.fuelType || 'Petrol',
        transmission: vehicle.transmission || 'Automatic',
        features: Array.isArray(vehicle.features) ? vehicle.features.join(', ') : '',
        status: vehicle.status?.toLowerCase() || 'available',
        currentImageUrl: vehicle.image || ''
      });
      setImagePreview(vehicle.image || '');
    }
  }, [vehicle]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    try {
      CloudinaryStorageService.validateFile(file);
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(formData.currentImageUrl || '');
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const prepareVehicleDataForAPI = async (serviceProviderId) => {
    let vehicleImageUrl = formData.currentImageUrl;

    // Only upload new image if user selected one
    if (imageFile) {
      try {
        setUploadProgress('Uploading image...');
        
        const fileName = CloudinaryStorageService.generateFileName(
          imageFile.name,
          serviceProviderId,
          0
        );
        vehicleImageUrl = await CloudinaryStorageService.uploadImage(imageFile, fileName);
        
        console.log('Image uploaded successfully:', vehicleImageUrl);
        setUploadProgress('Image uploaded successfully!');
        
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        setUploadProgress('');
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
    }

    const featuresArray = formData.features
      .split(',')
      .map(feature => feature.trim())
      .filter(feature => feature);

    const apiData = {
      serviceProviderId: parseInt(serviceProviderId),
      name: formData.name.trim(),
      type: formData.type.toUpperCase(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year: parseInt(formData.year),
      licensePlate: formData.licensePlate.trim(),
      ac: formData.ac,
      numberOfSeats: parseInt(formData.numberOfSeats),
      pricePerKmWithAC: parseFloat(formData.pricePerKmWithAC),
      pricePerKmWithoutAC: parseFloat(formData.pricePerKmWithoutAC),
      fuelType: formData.fuelType.toUpperCase(),
      transmission: formData.transmission.toUpperCase(),
      features: featuresArray,
      status: formData.status.toUpperCase(),
      image: vehicleImageUrl
    };

    console.log('API Data to be sent:', apiData);
    return apiData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploadProgress('');

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
      setError('Vehicle Name is required.');
      return;
    }

    const priceWithAC = parseFloat(formData.pricePerKmWithAC);
    const priceWithoutAC = parseFloat(formData.pricePerKmWithoutAC);
    if (isNaN(priceWithAC) || priceWithAC <= 0 || isNaN(priceWithoutAC) || priceWithoutAC <= 0) {
      setError('Valid prices are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      setUploadProgress('Preparing vehicle data...');
      const apiData = await prepareVehicleDataForAPI(serviceProviderId);
      
      setUploadProgress('Updating vehicle...');
      const response = await TravelVehicleService.updateVehicle(vehicle.id, apiData);
      
      console.log('Vehicle updated successfully:', response);
      setUploadProgress('Vehicle updated successfully! 🎉');

      if (onUpdate) {
        onUpdate(response);
      }

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (apiError) {
      console.error('Error updating vehicle:', apiError);
      setError(apiError.message || 'Failed to update vehicle. Please try again.');
      setUploadProgress('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Vehicle</h2>
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Luxury Coach"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type*</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Van">Van</option>
                  <option value="Car">Car</option>
                  <option value="Bus">Bus</option>
                  <option value="SUV">SUV</option>
                  <option value="Motorcycle">Motorcycle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand*</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Toyota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model*</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Hiace Super GL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year*</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., 2022"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Plate*</label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., NC-1234"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing (per km)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">With AC (Rs.)*</label>
                  <input
                    type="number"
                    name="pricePerKmWithAC"
                    value={formData.pricePerKmWithAC}
                    onChange={handleInputChange}
                    required
                    min="1"
                    step="0.01"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., 120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Without AC (Rs.)*</label>
                  <input
                    type="number"
                    name="pricePerKmWithoutAC"
                    value={formData.pricePerKmWithoutAC}
                    onChange={handleInputChange}
                    required
                    min="1"
                    step="0.01"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Capacity*</label>
                <input
                  type="number"
                  name="numberOfSeats"
                  value={formData.numberOfSeats}
                  onChange={handleInputChange}
                  required
                  min="1"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., 12"
                />
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  name="ac"
                  checked={formData.ac}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Air Conditioning Available</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type*</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission*</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows="3"
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Enter features, separated by commas (e.g., AC, WiFi, TV, Reclining Seats)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status*</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Image {imageFile && '(New image selected)'}
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <p className="text-xs text-gray-500">
                  Maximum file size: 10MB. Accepted formats: JPEG, PNG, WebP. Leave empty to keep current image.
                </p>
                
                {imagePreview && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        {imageFile ? 'New Image Preview' : 'Current Image'}
                      </p>
                      {imageFile && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                          disabled={isSubmitting}
                        >
                          <X className="w-4 h-4" />
                          Remove New Image
                        </button>
                      )}
                    </div>
                    <img 
                      src={imagePreview} 
                      alt="Vehicle preview" 
                      className="w-full max-w-xs h-48 object-cover rounded-lg border shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Vehicle'
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

export default EditVehicle;