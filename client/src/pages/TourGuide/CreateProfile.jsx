import React, { useState } from 'react';
import TourGuideProfileService from '../../api_service/TourGuideservice';
import CloudinaryStorageService from '../../api_service/Cloudinaryservice';
import { 
  Building, 
  Upload, 
  FileText, 
  Calendar, 
  Phone, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Star 
} from 'lucide-react';

const TourGuideProfileCreator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    profilePhoto: null,
    profilePhotoFile: null,
    profilePhotoUrl: '',
    description: '',
    establishedYear: '',
    numberOfGuides: '',
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    }
  });

  const steps = [
    { number: 1, title: 'Company Name', icon: Building },
    { number: 2, title: 'Profile Photo', icon: Upload },
    { number: 3, title: 'Description', icon: FileText },
    { number: 4, title: 'Company Details', icon: Calendar },
    { number: 5, title: 'Contact Info', icon: Phone }
  ];

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.companyName.trim()) {
          setError('Please enter your company name');
          return false;
        }
        break;
      case 2:
        if (!formData.profilePhotoFile) {
          setError('Please upload a profile photo');
          return false;
        }
        break;
      case 3:
        if (!formData.description.trim()) {
          setError('Please add a description for your company');
          return false;
        }
        break;
      case 4:
        if (!formData.establishedYear || !formData.numberOfGuides) {
          setError('Please provide establishment year and number of guides');
          return false;
        }
        break;
      case 5:
        if (!formData.contactInfo.email.trim() || !formData.contactInfo.phone.trim()) {
          setError('Please provide email and phone number');
          return false;
        }
        break;
    }
    return true;
  };

  const prepareFormDataForAPI = async () => {
    const initial_data = JSON.parse(localStorage.getItem("serviceProvider"))
    const serviceProviderId = initial_data.id;
    
    let companyPhotoUrl = '';
    if (formData.profilePhotoFile) {
      try {
        setUploadProgress('Validating image...');
        const fileName = CloudinaryStorageService.generateFileName(
          formData.profilePhotoFile.name, 
          serviceProviderId
        );
        
        setUploadProgress('Uploading image to storage...');
        companyPhotoUrl = await CloudinaryStorageService.uploadImage(formData.profilePhotoFile, fileName);
        console.log('Image uploaded successfully:', companyPhotoUrl);
        setUploadProgress('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        setUploadProgress('');
        throw new Error(`Image upload failed: ${error.message}`);
      }
    }
    
    return {
      serviceProviderId: parseInt(serviceProviderId),
      companyName: formData.companyName,
      profilePhotoUrl: companyPhotoUrl,
      description: formData.description,
      establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
      numberOfGuides: formData.numberOfGuides ? parseInt(formData.numberOfGuides) : null,
      contactInfo: {
        email: formData.contactInfo.email,
        phone: formData.contactInfo.phone,
        address: formData.contactInfo.address
      }
    };
  };

  const handleNext = async () => {
    setError('');
    setUploadProgress('');
    
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < 5) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Submit the form
      setIsSubmitting(true);
      try {
        setUploadProgress('Preparing profile data...');
        const apiData = await prepareFormDataForAPI();
        console.log('Submitting data:', apiData);
        
        setUploadProgress('Creating tour guide profile...');
        const response = await TourGuideProfileService.createProfile(apiData);
        console.log('Profile created successfully:', response);
        
        setUploadProgress('Profile created successfully!');
        setIsCompleted(true);
        
        // Redirect to tour guide dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/tour-guide/dashboard';
        }, 2000);
      } catch (error) {
        console.error('Error creating tour guide profile:', error);
        setError(error.message || 'Failed to create tour guide profile. Please try again.');
        setUploadProgress('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    setError('');
    setUploadProgress('');
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setError('');
    
    if (file) {
      try {
        // Validate file before processing
        CloudinaryStorageService.validateFile(file);
        
        // Show preview immediately
        updateFormData('profilePhoto', URL.createObjectURL(file));
        updateFormData('profilePhotoFile', file);
        console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
        
      } catch (error) {
        console.error('Error with file:', error);
        setError(error.message || 'Failed to process image. Please try again.');
        // Reset the photo on error
        updateFormData('profilePhoto', null);
        updateFormData('profilePhotoFile', null);
        // Reset file input
        event.target.value = '';
      }
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
            <p className="text-gray-600 text-lg">You've successfully finished setting up your tour guide company profile.</p>
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">What's your tour guide company name?</h2>
              <p className="text-gray-600">This will be displayed on your profile and to potential clients</p>
            </div>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none text-lg backdrop-blur-sm bg-white/90"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add your company logo or photo</h2>
              <p className="text-gray-600">Choose an image that represents your tour guide company (Max 10MB, JPEG/PNG/WebP)</p>
            </div>
            <div className="max-w-md mx-auto">
              {formData.profilePhoto ? (
                <div className="relative">
                  <img
                    src={formData.profilePhoto}
                    alt="Company profile"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      updateFormData('profilePhoto', null);
                      updateFormData('profilePhotoFile', null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                  {formData.profilePhotoFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>File: {formData.profilePhotoFile.name}</p>
                      <p>Size: {(formData.profilePhotoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              ) : (
                <label className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0B9ED9] transition-colors bg-gray-50/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-gray-600">Click to upload photo</span>
                    <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP - Max 10MB</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Describe your tour guide company</h2>
              <p className="text-gray-600">Tell clients about your services, expertise, and what makes you special</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <textarea
                placeholder="Write about your tour guide company, types of tours you offer, your experience, and what makes your services unique..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none resize-none backdrop-blur-sm bg-white/90"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Company details</h2>
              <p className="text-gray-600">Tell us about your company's background and team size</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                <input
                  type="number"
                  placeholder="e.g., 2010"
                  value={formData.establishedYear}
                  onChange={(e) => updateFormData('establishedYear', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none backdrop-blur-sm bg-white/90"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Tour Guides</label>
                <input
                  type="number"
                  placeholder="e.g., 15"
                  value={formData.numberOfGuides}
                  onChange={(e) => updateFormData('numberOfGuides', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none backdrop-blur-sm bg-white/90"
                  min="1"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact information</h2>
              <p className="text-gray-600">How can clients reach you?</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <input
                type="tel"
                placeholder="Phone number *"
                value={formData.contactInfo.phone}
                onChange={(e) => updateContactInfo('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none backdrop-blur-sm bg-white/90"
                required
              />
              <input
                type="email"
                placeholder="Email address *"
                value={formData.contactInfo.email}
                onChange={(e) => updateContactInfo('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none backdrop-blur-sm bg-white/90"
                required
              />
              <textarea
                placeholder="Business address"
                value={formData.contactInfo.address}
                onChange={(e) => updateContactInfo('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9ED9] focus:border-transparent outline-none resize-none backdrop-blur-sm bg-white/90"
              />
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
        backgroundImage: 'url("https://images.pexels.com/photos/15281564/pexels-photo-15281564.jpeg")',
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
          disabled={currentStep === 1 || isCompleted || isTransitioning || isSubmitting}
          className={`absolute left-8 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm ${
            currentStep === 1 || isCompleted || isTransitioning || isSubmitting
              ? 'bg-white/30 text-gray-400 cursor-not-allowed'
              : 'bg-white/80 shadow-lg text-gray-700 hover:bg-white hover:shadow-xl'
          }`}
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={isTransitioning || isSubmitting}
          className={`absolute right-8 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm ${
            isTransitioning || isSubmitting
              ? 'bg-white/30 text-gray-400 cursor-not-allowed'
              : isCompleted
              ? 'bg-green-600/90 text-white hover:bg-green-700 shadow-lg'
              : 'bg-[#0B9ED9]/90 text-white hover:bg-[#0B9ED9] shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ChevronRight className="w-7 h-7" />
          )}
        </button>

        {/* Main Card */}
        <div className={`bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl transition-all duration-300 ${
          isTransitioning ? 'opacity-70 scale-98' : 'opacity-100 scale-100'
        }`}>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="mx-8 mt-6 p-4 bg-[#0B9ED9]/10 border border-[#0B9ED9]/20 rounded-lg flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-[#0B9ED9] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
              <p className="text-[#0B9ED9] text-sm">{uploadProgress}</p>
            </div>
          )}

          {/* Content */}
          <div className="px-8 pt-8 pb-6" style={{ minHeight: '350px' }}>
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
              {renderStepContent()}
            </div>
          </div>

          {/* Progress Steps - Bottom center */}
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
                <span>
                  {isSubmitting ? 'Creating profile...' : 
                   currentStep === 5 ? 'Click to create profile' : 'Continue to proceed'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourGuideProfileCreator;