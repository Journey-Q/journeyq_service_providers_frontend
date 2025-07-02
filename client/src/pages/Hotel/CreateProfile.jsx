import React, { useState, useRef } from 'react';
import { MapPin, Upload, Star, Wifi, Car, Coffee, Utensils, Users, Phone, Mail, Globe, Camera, X, Home } from 'lucide-react';

const CreateProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    hotelName: '',
    location: '',
    coordinates: { lat: '', lng: '' },
    description: '',
    hotelPhotos: [],
    amenities: [],
    numberOfRooms: '',
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    },
    starRating: 0
  });
  
  const fileInputRef = useRef(null);
  
  const steps = [
    { id: 1, title: 'Hotel Name', icon: <Users className="w-5 h-5" /> },
    { id: 2, title: 'Location', icon: <MapPin className="w-5 h-5" /> },
    { id: 3, title: 'Hotel Photos', icon: <Camera className="w-5 h-5" /> },
    { id: 4, title: 'Description', icon: <Coffee className="w-5 h-5" /> },
    { id: 5, title: 'Details', icon: <Star className="w-5 h-5" /> }
  ];

  const amenityOptions = [
    { id: 'wifi', label: 'Free WiFi', icon: <Wifi className="w-4 h-4" /> },
    { id: 'parking', label: 'Parking', icon: <Car className="w-4 h-4" /> },
    { id: 'restaurant', label: 'Restaurant', icon: <Utensils className="w-4 h-4" /> },
    { id: 'spa', label: 'Spa & Wellness', icon: <Coffee className="w-4 h-4" /> },
    { id: 'pool', label: 'Swimming Pool', icon: <Users className="w-4 h-4" /> },
    { id: 'gym', label: 'Fitness Center', icon: <Home className="w-4 h-4" /> }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      if (formData.hotelPhotos.length >= 6) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          hotelPhotos: [...prev.hotelPhotos, {
            id: Date.now() + Math.random(),
            src: e.target.result,
            name: file.name
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      hotelPhotos: prev.hotelPhotos.filter(photo => photo.id !== photoId)
    }));
  };

  const handleLocationSelect = () => {
    const sampleLocations = [
      { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
      { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
      { name: 'Miami, FL', lat: 25.7617, lng: -80.1918 },
      { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 }
    ];
    const randomLocation = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    
    setFormData(prev => ({
      ...prev,
      location: randomLocation.name,
      coordinates: { lat: randomLocation.lat, lng: randomLocation.lng }
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0088cc] to-[#0066aa] rounded-full mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">What's your hotel name?</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">Choose a memorable name that represents your property and attracts guests</p>
            </div>
            <div className="max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Enter your hotel name..."
                value={formData.hotelName}
                onChange={(e) => handleInputChange('hotelName', e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#0088cc] focus:outline-none text-xl shadow-sm transition-all duration-200 hover:shadow-md"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0088cc] to-[#0066aa] rounded-full mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Where is your hotel located?</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">Help guests find you easily with an accurate location</p>
            </div>
            <div className="max-w-lg mx-auto space-y-6">
              <div 
                className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-[#0088cc] hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                onClick={handleLocationSelect}
              >
                <MapPin className="w-16 h-16 text-[#0088cc] mx-auto mb-6" />
                <p className="text-gray-700 mb-6 text-lg">Click to select location on map</p>
                <button className="bg-gradient-to-r from-[#0088cc] to-[#0066aa] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium">
                  Open Google Maps
                </button>
              </div>
              {formData.location && (
                <div className="bg-gradient-to-r from-[#0088cc]/10 to-[#0066aa]/10 border-2 border-[#0088cc] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-[#0088cc]" />
                    <span className="text-[#0088cc] font-semibold text-lg">{formData.location}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0088cc] to-[#0066aa] rounded-full mb-6">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Add your hotel photos</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">Upload up to 6 beautiful images that showcase your property</p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {formData.hotelPhotos.map((photo, index) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
                      <img 
                        src={photo.src} 
                        alt={`Hotel photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    {index === 0 && (
                      <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[#0088cc] to-[#0066aa] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md">
                        Main Photo
                      </div>
                    )}
                  </div>
                ))}
                
                {Array.from({ length: Math.max(0, 6 - formData.hotelPhotos.length) }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#0088cc] hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-10 h-10 text-gray-400 mb-3 group-hover:text-[#0088cc] transition-colors" />
                    <span className="text-sm text-gray-500 group-hover:text-[#0088cc] font-medium">Add Photo</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#0088cc] rounded-full"></div>
                    <span className="font-medium">📸 {formData.hotelPhotos.length}/6 photos uploaded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#0088cc] rounded-full"></div>
                    <span>First photo will be your main image</span>
                  </div>
                </div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={formData.hotelPhotos.length >= 6}
                  className={`inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-md ${
                    formData.hotelPhotos.length >= 6
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#0088cc] to-[#0066aa] text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  <span>
                    {formData.hotelPhotos.length === 0 
                      ? 'Upload Your First Photo' 
                      : formData.hotelPhotos.length >= 6 
                      ? 'Maximum Photos Reached'
                      : `Add More Photos (${6 - formData.hotelPhotos.length} remaining)`
                    }
                  </span>
                </button>
                
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG • Max size: 10MB per photo
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0088cc] to-[#0066aa] rounded-full mb-6">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Describe your hotel</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">Tell guests what makes your property special and unique</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <textarea
                placeholder="Describe your hotel's unique features, location benefits, amenities, and what guests can expect during their stay. Share what makes your property stand out..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={8}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#0088cc] focus:outline-none resize-none shadow-sm hover:shadow-md transition-all duration-200 text-lg leading-relaxed"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">Make it compelling and informative</span>
                <span className="text-sm text-gray-500 font-medium">{formData.description.length}/500 characters</span>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0088cc] to-[#0066aa] rounded-full mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Final details</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">Add star rating, room count, amenities, and contact information</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-12">
              {/* Star Rating */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <label className="block text-xl font-semibold text-gray-800 mb-6">Star Rating</label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-12 h-12 cursor-pointer transition-all duration-200 hover:scale-110 ${
                        star <= formData.starRating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                      onClick={() => handleInputChange('starRating', star)}
                    />
                  ))}
                </div>
                <p className="text-center text-gray-600 mt-4">Click to select your hotel's star rating</p>
              </div>

              {/* Number of Rooms */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <label className="block text-xl font-semibold text-gray-800 mb-6">Number of Rooms</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                  {[5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200].map((roomCount) => (
                    <div
                      key={roomCount}
                      className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                        formData.numberOfRooms === roomCount.toString()
                          ? 'border-[#0088cc] bg-gradient-to-r from-[#0088cc]/10 to-[#0066aa]/10 text-[#0088cc] shadow-md'
                          : 'border-gray-200 hover:border-[#0088cc] text-gray-700 hover:shadow-md'
                      }`}
                      onClick={() => handleInputChange('numberOfRooms', roomCount.toString())}
                    >
                      <span className="font-semibold text-lg">{roomCount}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <label className="block text-sm font-medium text-gray-600 mb-3">Or enter a custom number:</label>
                  <input
                    type="number"
                    placeholder="Enter number of rooms"
                    value={formData.numberOfRooms}
                    onChange={(e) => handleInputChange('numberOfRooms', e.target.value)}
                    min="1"
                    max="1000"
                    className="w-full max-w-xs px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0088cc] focus:outline-none shadow-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <label className="block text-xl font-semibold text-gray-800 mb-6">Amenities</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {amenityOptions.map((amenity) => (
                    <div
                      key={amenity.id}
                      className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                        formData.amenities.includes(amenity.id)
                          ? 'border-[#0088cc] bg-gradient-to-r from-[#0088cc]/10 to-[#0066aa]/10 shadow-md'
                          : 'border-gray-200 hover:border-[#0088cc] hover:shadow-md'
                      }`}
                      onClick={() => handleAmenityToggle(amenity.id)}
                    >
                      <div className={`p-2 rounded-lg ${
                        formData.amenities.includes(amenity.id) ? 'bg-[#0088cc] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {amenity.icon}
                      </div>
                      <span className={`font-medium text-lg ${
                        formData.amenities.includes(amenity.id) ? 'text-[#0088cc]' : 'text-gray-700'
                      }`}>
                        {amenity.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <label className="block text-xl font-semibold text-gray-800 mb-6">Contact Information</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative">
                    <Phone className="w-5 h-5 text-[#0088cc] absolute left-4 top-4" />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#0088cc] focus:outline-none shadow-sm transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-[#0088cc] absolute left-4 top-4" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#0088cc] focus:outline-none shadow-sm transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="w-5 h-5 text-[#0088cc] absolute left-4 top-4" />
                    <input
                      type="url"
                      placeholder="Website URL"
                      value={formData.contactInfo.website}
                      onChange={(e) => handleInputChange('contactInfo.website', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#0088cc] focus:outline-none shadow-sm transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col min-h-screen">
        {/* Progress Steps */}
        <div className="bg-white shadow-lg border-b border-gray-200">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-3 ${
                    currentStep >= step.id ? 'text-[#0088cc]' : 'text-gray-400'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                      currentStep >= step.id 
                        ? 'bg-gradient-to-r from-[#0088cc] to-[#0066aa] text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {currentStep > step.id ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className="font-semibold hidden sm:block text-lg">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-6 rounded-full transition-all duration-300 ${
                      currentStep > step.id ? 'bg-gradient-to-r from-[#0088cc] to-[#0066aa]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="px-8 py-6">
            <div className="flex justify-between max-w-5xl mx-auto">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={currentStep === 5 ? () => alert('Profile Created!') : nextStep}
                className="bg-gradient-to-r from-[#0088cc] to-[#0066aa] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                {currentStep === 5 ? 'Create Profile' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;