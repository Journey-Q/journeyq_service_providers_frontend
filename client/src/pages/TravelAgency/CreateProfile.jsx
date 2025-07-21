import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Upload, FileText, Settings, Check, Star, Calendar, Home, Bus, Phone, Mail } from 'lucide-react';

const CreateProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    agencyName: '',
    profilePhoto: null,
    description: '',
    agencyInfo: {
      establishedYear: '',
      fleetSize: ''
    },
    contactInfo: {
      phone: '',
      address: '',
      email: ''
    }
  });

  const steps = [
    { number: 1, title: 'Agency Name', icon: Bus },
    { number: 2, title: 'Profile Photo', icon: Upload },
    { number: 3, title: 'Description', icon: FileText },
    { number: 4, title: 'Agency Info', icon: Calendar },
    { number: 5, title: 'Contact Info', icon: Phone }
  ];

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsCompleted(true);
        setTimeout(() => {
          window.location.href = '/travel-agency/dashboard';
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

  const updateAgencyInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      agencyInfo: {
        ...prev.agencyInfo,
        [field]: value
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
            <p className="text-gray-600 text-lg">Your travel agency profile is ready to go.</p>
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">What's your agency name?</h2>
              <p className="text-gray-600">This will be displayed on your profile and in search results</p>
            </div>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter agency name"
                value={formData.agencyName}
                onChange={(e) => updateFormData('agencyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent outline-none text-lg"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add a profile photo</h2>
              <p className="text-gray-600">Choose a photo that represents your agency</p>
            </div>
            <div className="max-w-md mx-auto">
              {formData.profilePhoto ? (
                <div className="relative">
                  <img
                    src={formData.profilePhoto}
                    alt="Agency profile"
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
                <label className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#2953A6] transition-colors bg-gray-50">
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

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Describe your agency</h2>
              <p className="text-gray-600">Tell customers about your travel services and specialties</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <textarea
                placeholder="Write about your agency, the types of travel services you offer, destinations you specialize in, and what makes you unique..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Agency Information</h2>
              <p className="text-gray-600">Tell us more about your travel agency</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                <input
                  type="number"
                  placeholder="Year your agency was founded"
                  value={formData.agencyInfo.establishedYear}
                  onChange={(e) => updateAgencyInfo('establishedYear', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fleet Size</label>
                <input
                  type="number"
                  placeholder="Number of vehicles in your fleet"
                  value={formData.agencyInfo.fleetSize}
                  onChange={(e) => updateAgencyInfo('fleetSize', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Information</h2>
              <p className="text-gray-600">How can customers reach you?</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.contactInfo.phone}
                  onChange={(e) => updateContactInfo('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.contactInfo.email}
                  onChange={(e) => updateContactInfo('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-start space-x-2">
                <Home className="w-5 h-5 text-gray-500 mt-1.5" />
                <textarea
                  placeholder="Office address"
                  value={formData.contactInfo.address}
                  onChange={(e) => updateContactInfo('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent outline-none resize-none"
                />
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
        backgroundImage: `url('https://images.pexels.com/photos/15281564/pexels-photo-15281564.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Left Arrow */}
      <button
        onClick={handlePrevious}
        disabled={currentStep === 1 || isCompleted || isTransitioning}
        className={`fixed left-8 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
          currentStep === 1 || isCompleted || isTransitioning
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-white shadow-lg text-[#2953A6] hover:bg-gray-50 hover:shadow-xl'
        }`}
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        disabled={isTransitioning}
        className={`fixed right-8 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
          isTransitioning
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isCompleted
            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
            : 'bg-[#2953A6] text-white hover:bg-[#1F74BF] shadow-lg'
        }`}
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Main Card */}
      <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl transition-all duration-300 relative z-0 ${
        isTransitioning ? 'opacity-70 scale-98' : 'opacity-100 scale-100'
      }`}>
        {/* Content */}
        <div className="px-8 pt-8 pb-6" style={{ minHeight: '350px' }}>
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            {renderStepContent()}
          </div>
        </div>

        {/* Progress Steps */}
        {!isCompleted && (
          <div className="px-8 pb-6">
            <div className="flex items-center justify-center space-x-6">
              {steps.map((step) => {
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
                          ? 'bg-[#2953A6] text-white shadow-lg'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompletedStep ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Icon className="w-3 h-3" />
                      )}
                    </div>
                    <span className={`text-xs mt-1 font-medium ${isActive ? 'text-[#2953A6]' : 'text-gray-500'}`}>
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
          <div className="border-t border-gray-200 px-8 py-3 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Step {currentStep} of {steps.length}</span>
              <span>Continue to proceed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProfile;