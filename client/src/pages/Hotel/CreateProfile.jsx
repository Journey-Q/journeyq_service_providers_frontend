import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Upload, MapPin, Building, FileText, Settings, Check, Star } from 'lucide-react';

const HotelProfileCreator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: '',
    location: '',
    profilePhoto: null,
    description: '',
    amenities: {
      wifi: false,
      parking: false,
      restaurant: false,
      spa: false,
      pool: false,
      fitness: false
    },
    contactInfo: {
      phone: '',
      address: '',
      email: ''
    },
    placeDetails: null
  });

  const steps = [
    { number: 1, title: 'Hotel Name', icon: Building },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Profile Photo', icon: Upload },
    { number: 4, title: 'Description', icon: FileText },
    { number: 5, title: 'Details', icon: Settings }
  ];

  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (currentStep === 2) {
      const loadGoogleMapsScript = () => {
        if (window.google && window.google.maps) {
          initializeAutocomplete();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCFbprhDc_fKXUHl-oYEVGXKD1HciiAsz0&libraries=places`;
        script.async = true;
        script.onload = initializeAutocomplete;
        document.head.appendChild(script);
      };

      const initializeAutocomplete = () => {
        const input = document.getElementById('location-search');
        if (!input || !mapContainerRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ['establishment'],
          fields: ['name', 'formatted_address', 'geometry', 'place_id']
        });

        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          mapTypeControl: false
        });

        const marker = new window.google.maps.Marker({
          map: map
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (!place.geometry) {
            console.log("No details available for input: '" + place.name + "'");
            marker.setVisible(false);
            return;
          }

          // Update form data with place details including lat/lng
          setFormData(prev => ({
            ...prev,
            location: place.name || place.formatted_address,
            placeDetails: {
              displayName: place.name || place.formatted_address,
              formattedAddress: place.formatted_address,
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            },
            contactInfo: {
              ...prev.contactInfo,
              address: place.formatted_address || ''
            }
          }));

          // Center the map on the selected place
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }

          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
        });
      };

      loadGoogleMapsScript();

      return () => {
        // Cleanup if needed
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = '';
        }
      };
    }
  }, [currentStep]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsCompleted(true);
        setTimeout(() => {
          console.log('Form data to submit:', formData);
          window.location.href = '/hotel/dashboard';
        }, 2000);
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
      }
      setIsTransitioning(false);
    }, 300);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateContactInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const updateAmenity = (amenity, checked) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: checked
      }
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      updateFormData('profilePhoto', URL.createObjectURL(file));
    }
  };

  const renderStepContent = () => {
    if (isCompleted) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Profile Setup Complete!</h2>
            <p className="text-gray-600 text-lg">You've successfully finished setting up your hotel profile.</p>
            <p className="text-gray-500 text-sm mt-2">Redirecting to dashboard...</p>
          </div>
          <div className="flex space-x-1">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">What's your hotel name?</h2>
              <p className="text-gray-600">This will be displayed on your profile and in search results</p>
            </div>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter hotel name"
                value={formData.hotelName}
                onChange={(e) => updateFormData('hotelName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none text-lg backdrop-blur-sm bg-white/90"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Where is your hotel located?</h2>
              <p className="text-gray-600">Search for your hotel location</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <input
                  id="location-search"
                  type="text"
                  placeholder="Enter hotel location"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none text-lg backdrop-blur-sm bg-white/90"
                  autoComplete="off"
                />
              </div>
              <div className="bg-gray-100/80 backdrop-blur-sm rounded-lg p-4 h-64">
                <div 
                  ref={mapContainerRef} 
                  className="w-full h-full rounded-md"
                  style={{ minHeight: '200px' }}
                ></div>
              </div>
              {formData.placeDetails && (
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800">Selected Location:</h4>
                  <p className="text-blue-700">{formData.placeDetails.displayName}</p>
                  <p className="text-sm text-blue-600">{formData.placeDetails.formattedAddress}</p>
                  {formData.placeDetails.location && (
                    <p className="text-xs text-blue-500 mt-1">
                      Coordinates: {formData.placeDetails.location.lat.toFixed(6)}, {formData.placeDetails.location.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add a profile photo</h2>
              <p className="text-gray-600">Choose a photo that represents your hotel</p>
            </div>
            <div className="max-w-md mx-auto">
              {formData.profilePhoto ? (
                <div className="relative">
                  <img
                    src={formData.profilePhoto}
                    alt="Hotel profile"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => updateFormData('profilePhoto', null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0B9ED9] transition-colors bg-gray-50/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-gray-600">Click to upload photo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Describe your hotel</h2>
              <p className="text-gray-600">Tell guests what makes your hotel special</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <textarea
                placeholder="Write a compelling description of your hotel, its unique features, and what guests can expect..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none resize-none backdrop-blur-sm bg-white/90"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Hotel details</h2>
              <p className="text-gray-600">Add amenities and contact information</p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'wifi', label: 'Free WiFi' },
                    { key: 'parking', label: 'Parking' },
                    { key: 'restaurant', label: 'Restaurant' },
                    { key: 'spa', label: 'Spa & Wellness' },
                    { key: 'pool', label: 'Swimming Pool' },
                    { key: 'fitness', label: 'Fitness Center' }
                  ].map(amenity => (
                    <label key={amenity.key} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities[amenity.key]}
                        onChange={(e) => updateAmenity(amenity.key, e.target.checked)}
                        className="w-4 h-4 text-[#0B9ED9] border-gray-300 rounded focus:ring-[#0B9ED9]"
                      />
                      <span className="text-gray-700">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.contactInfo.phone}
                    onChange={(e) => updateContactInfo('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none backdrop-blur-sm bg-white/90"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.contactInfo.email}
                    onChange={(e) => updateContactInfo('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none backdrop-blur-sm bg-white/90"
                  />
                  <textarea
                    placeholder="Full address"
                    value={formData.contactInfo.address}
                    onChange={(e) => updateContactInfo('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none resize-none backdrop-blur-sm bg-white/90"
                  />
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
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/1183172/pexels-photo-1183172.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      
      <div className="relative w-full h-full flex items-center justify-center" style={{ padding: '1cm' }}>
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1 || isCompleted || isTransitioning}
          className={`absolute left-8 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm ${
            currentStep === 1 || isCompleted || isTransitioning
              ? 'bg-white/30 text-gray-400 cursor-not-allowed'
              : 'bg-white/80 shadow-lg text-gray-700 hover:bg-white hover:shadow-xl'
          }`}
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className={`absolute right-8 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm ${
            isTransitioning
              ? 'bg-white/30 text-gray-400 cursor-not-allowed'
              : isCompleted
              ? 'bg-green-600/90 text-white hover:bg-green-700 shadow-lg'
              : 'bg-[#0B9ED9]/90 text-white hover:bg-[#0B9ED9] shadow-lg'
          }`}
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* Main Card */}
        <div className={`bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl transition-all duration-300 ${
          isTransitioning ? 'opacity-70 scale-98' : 'opacity-100 scale-100'
        }`}>

          {/* Content */}
          <div className="px-8 pt-8 pb-6" style={{ minHeight: '350px' }}>
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
              {renderStepContent()}
            </div>
          </div>

          {/* Progress Steps - Moved to bottom */}
          {!isCompleted && (
            <div className="px-8 pb-6">
              <div className="flex items-center justify-center space-x-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompletedStep = currentStep > step.number;
                  
                  return (
                    <div key={step.number} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompletedStep
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-[#0B9ED9] text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompletedStep ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Icon className="w-3 h-3" />
                        )}
                      </div>
                      <span className={`text-xs mt-1 font-medium ${isActive ? 'text-[#0B9ED9]' : 'text-gray-500'}`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Info */}
          {!isCompleted && (
            <div className="border-t border-gray-200/50 px-8 py-3 bg-gray-50/50 backdrop-blur-sm">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Step {currentStep} of {steps.length}</span>
                <span>Continue to proceed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelProfileCreator;