import React, { useState } from 'react';
import TourPackageService from '../../api_service/TourPackageService';
import CloudinaryStorageService from '../../api_service/Cloudinaryservice';
import { AlertTriangle, Loader2, X, Plus, Trash2 } from 'lucide-react';

const InsertTour = ({ showModal, setShowModal, onTourAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: '1 day',
    minPeople: '2',
    maxPeople: '15',
    status: 'available',
    originalPrice: '',
    discount: '0',
    places: '',
    highlights: '',
    aboutTour: '',
    included: '',
    importantNotes: '',
    imageFile: null,
    imagePreview: ''
  });

  const [itinerary, setItinerary] = useState([
    { time: '', activity: '' }
  ]);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[index][field] = value;
    setItinerary(newItinerary);
  };

  const addItineraryItem = () => {
    setItinerary([...itinerary, { time: '', activity: '' }]);
  };

  const removeItineraryItem = (index) => {
    if (itinerary.length > 1) {
      const newItinerary = itinerary.filter((_, i) => i !== index);
      setItinerary(newItinerary);
    }
  };

  const calculateFinalPrice = (originalPrice, discount) => {
    const price = parseFloat(originalPrice) || 0;
    const discountValue = parseFloat(discount) || 0;
    return Math.round(price - (price * discountValue / 100));
  };

  const getCurrentFinalPrice = () => {
    return calculateFinalPrice(formData.originalPrice, formData.discount);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    try {
      CloudinaryStorageService.validateFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: e.target.result
        }));
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
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      imagePreview: ''
    }));
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const prepareTourDataForAPI = async (serviceProviderId) => {
    let tourImageUrl = '';

    if (formData.imageFile) {
      try {
        setUploadProgress('Uploading image...');
        
        const fileName = CloudinaryStorageService.generateFileName(
          formData.imageFile.name,
          serviceProviderId,
          0
        );
        tourImageUrl = await CloudinaryStorageService.uploadImage(formData.imageFile, fileName);
        
        console.log('Image uploaded successfully:', tourImageUrl);
        setUploadProgress('Image uploaded successfully!');
        
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        setUploadProgress('');
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
    }

    // Convert comma-separated strings to arrays
    const placesArray = formData.places
      .split(',')
      .map(place => place.trim())
      .filter(place => place);

    const highlightsArray = formData.highlights
      .split(',')
      .map(highlight => highlight.trim())
      .filter(highlight => highlight);

    const includedArray = formData.included
      .split(',')
      .map(item => item.trim())
      .filter(item => item);

    const importantNotesArray = formData.importantNotes
      .split(',')
      .map(note => note.trim())
      .filter(note => note);

    // Filter out empty itinerary items
    const itineraryArray = itinerary
      .filter(item => item.time.trim() && item.activity.trim())
      .map(item => ({
        time: item.time.trim(),
        activity: item.activity.trim()
      }));

    const finalPrice = calculateFinalPrice(formData.originalPrice, formData.discount);

    // Prepare API data matching the backend structure
    const apiData = {
      serviceProviderId: parseInt(serviceProviderId),
      name: formData.name.trim(),
      image: tourImageUrl,
      originalPrice: parseFloat(formData.originalPrice),
      discount: parseFloat(formData.discount),
      finalPrice: finalPrice,
      pricePerPerson: finalPrice,
      duration: formData.duration,
      places: placesArray,
      highlights: highlightsArray,
      status: formData.status.toUpperCase(),
      rating: 0 || "5", 
      maxPeople: parseInt(formData.maxPeople),
      minPeople: parseInt(formData.minPeople),
      aboutTour: formData.aboutTour.trim(),
      included: includedArray,
      importantNotes: importantNotesArray,
      itinerary: itineraryArray,
      pastTourImages: []
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

    // Validation
    if (!formData.name.trim()) {
      setError('Tour Name is required.');
      return;
    }

    const originalPrice = parseFloat(formData.originalPrice);
    if (isNaN(originalPrice) || originalPrice <= 0) {
      setError('Valid original price is required.');
      return;
    }

    if (!formData.imageFile) {
      setError('Please upload an image for the tour.');
      return;
    }

    const minPeople = parseInt(formData.minPeople);
    const maxPeople = parseInt(formData.maxPeople);
    if (minPeople > maxPeople) {
      setError('Minimum people cannot be greater than maximum people.');
      return;
    }

    setIsSubmitting(true);

    try {
      setUploadProgress('Preparing tour data...');
      const apiData = await prepareTourDataForAPI(serviceProviderId);
      
      setUploadProgress('Creating tour package...');
      const response = await TourPackageService.createTourPackage(apiData);
      
      console.log('Tour created successfully:', response);
      setUploadProgress('Tour created successfully! 🎉');

      if (onTourAdded) {
        onTourAdded(response);
      }

      setTimeout(() => {
        resetForm();
        setShowModal(false);
      }, 1500);

    } catch (apiError) {
      console.error('Error creating tour:', apiError);
      setError(apiError.message || 'Failed to add tour. Please try again.');
      setUploadProgress('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      duration: '1 day',
      minPeople: '2',
      maxPeople: '15',
      status: 'available',
      originalPrice: '',
      discount: '0',
      places: '',
      highlights: '',
      aboutTour: '',
      included: '',
      importantNotes: '',
      imageFile: null,
      imagePreview: ''
    });
    setItinerary([{ time: '', activity: '' }]);
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
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Tour</h2>
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
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tour Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                    placeholder="Enter tour name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration*</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                  >
                    <option value="1 day">1 day</option>
                    <option value="2 days">2 days</option>
                    <option value="3 days">3 days</option>
                    <option value="4 days">4 days</option>
                    <option value="5 days">5 days</option>
                    <option value="1 week">1 week</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min People*</label>
                    <input
                      type="number"
                      name="minPeople"
                      value={formData.minPeople}
                      onChange={handleInputChange}
                      required
                      min="1"
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max People*</label>
                    <input
                      type="number"
                      name="maxPeople"
                      value={formData.maxPeople}
                      onChange={handleInputChange}
                      required
                      min="1"
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tour Status*</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Discount</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (LKR)*</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      required
                      min="1"
                      step="0.01"
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      placeholder="Enter original price"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      placeholder='Enter percentage (0-100)'
                    />
                  </div>

                  {formData.originalPrice && (
                    <div className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Final Price per person:</span>
                        <div className="text-right">
                          {formData.discount > 0 ? (
                            <>
                              <div className="font-semibold text-lg text-green-600">
                                Rs{getCurrentFinalPrice().toLocaleString('en-IN')}
                              </div>
                              <div className="text-sm text-gray-500 line-through">
                                Rs{parseInt(formData.originalPrice).toLocaleString('en-IN')}
                              </div>
                              <div className="text-xs text-green-600">
                                Save Rs{(parseInt(formData.originalPrice) - getCurrentFinalPrice()).toLocaleString('en-IN')}
                              </div>
                            </>
                          ) : (
                            <div className="font-semibold text-lg">
                              Rs{parseInt(formData.originalPrice).toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tour Image*</label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      required={!formData.imageFile}
                    />
                    <p className="text-xs text-gray-500">
                      Maximum file size: 10MB. Accepted formats: JPEG, PNG, WebP.
                    </p>
                    {formData.imagePreview && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium text-gray-700">Image Preview</p>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={isSubmitting}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Remove Image
                          </button>
                        </div>
                        <img 
                          src={formData.imagePreview} 
                          alt="Preview" 
                          className="w-full max-w-xs h-48 object-cover rounded-lg border shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Places Visited</label>
                <textarea
                  name="places"
                  value={formData.places}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                  placeholder="Enter places visited, separated by commas (e.g., Sigiriya Rock, Dambulla Cave Temple)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tour Highlights</label>
                <textarea
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                  placeholder="Enter highlights, separated by commas (e.g., Cultural experience, Scenic views, Local cuisine)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About This Tour</label>
                <textarea
                  name="aboutTour"
                  value={formData.aboutTour}
                  onChange={handleInputChange}
                  rows="4"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                  placeholder="Describe the tour in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
                <textarea
                  name="included"
                  value={formData.included}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                  placeholder="Enter what's included, separated by commas (e.g., Transportation, Guide, Meals, Accommodation)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Important Notes</label>
                <textarea
                  name="importantNotes"
                  value={formData.importantNotes}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                  placeholder="Enter important notes, separated by commas (e.g., Bring comfortable shoes, Weather dependent, ID required)"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tour Itinerary</label>
                  <button
                    type="button"
                    onClick={addItineraryItem}
                    disabled={isSubmitting}
                    className="flex items-center gap-1 px-3 py-1 bg-[#2953A6] hover:bg-[#1F74BF] text-white text-sm rounded-lg transition-colors disabled:bg-gray-400"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {itinerary.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => handleItineraryChange(index, 'time', e.target.value)}
                          disabled={isSubmitting}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                          placeholder="Time (e.g., 8:00 AM)"
                        />
                      </div>
                      <div className="flex-[2]">
                        <input
                          type="text"
                          value={item.activity}
                          onChange={(e) => handleItineraryChange(index, 'activity', e.target.value)}
                          disabled={isSubmitting}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                          placeholder="Activity description"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItineraryItem(index)}
                        disabled={isSubmitting || itinerary.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add time and activity details for each part of the tour (optional)
                </p>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#2953A6] hover:bg-[#1F74BF] text-white py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Add Tour'
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

export default InsertTour;