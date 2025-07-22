import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SidebarHotel';
import { 
  Edit2, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Star, 
  Eye, 
  EyeOff, 
  Shield, 
  Bell, 
  Trash2,
  AlertTriangle,
  Camera,
  Cog,
  Lock,
  Wifi,
  ParkingSquare,
  Utensils,
  Coffee,
  Users,
  Dumbbell,
  Clock
} from 'lucide-react';

const Settings = () => {
  const [profileData, setProfileData] = useState({
    hotelName: 'Hotel Quasar',
    email: 'admin@hotelquasar.com',
    phone: '+1 (555) 123-4567',
    address: '123 Ocean Drive, Miami Beach, FL 33139',
    description: 'Luxury beachfront hotel offering premium amenities and exceptional service with stunning ocean views.',
    starRating: 4,
    numberOfRooms: 75,
    open247: true,
    location: {
      lat: 25.7617,
      lng: -80.1918
    },
    amenities: {
      wifi: true,
      parking: true,
      restaurant: true,
      spa: true,
      pool: true,
      fitness: true
    }
  });

  const [securitySettings, setSecuritySettings] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
    loginAlerts: true
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage] = useState('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCFbprhDc_fKXUHl-oYEVGXKD1HciiAsz0&libraries=places`;
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize autocomplete when editing and map is loaded
  useEffect(() => {
    if (isEditingProfile && mapLoaded) {
      const input = document.getElementById('location-search');
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ['establishment'],
          fields: ['name', 'formatted_address', 'geometry']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            setProfileData(prev => ({
              ...prev,
              address: place.formatted_address || prev.address,
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            }));
          }
        });
      }
    }
  }, [isEditingProfile, mapLoaded]);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity, value) => {
    setProfileData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: value
      }
    }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    // Save profile logic here
    setIsEditingProfile(false);
    alert('Profile updated successfully!');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      alert('Account deletion initiated. You will receive a confirmation email.');
      setShowDeleteSection(false);
      setDeleteConfirmation('');
    } else {
      alert('Please type "DELETE" to confirm account deletion.');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#0088cc]/10 p-3 rounded-lg">
                    <User className="w-6 h-6 text-[#0088cc]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Hotel Profile</h2>
                    <p className="text-gray-600">Manage your hotel information</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    isEditingProfile
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-[#0088cc] text-white hover:bg-[#0077bb]'
                  }`}
                >
                  {isEditingProfile ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              {isEditingProfile ? (
                <div className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img 
                        src={profileImage} 
                        alt="Hotel" 
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <button className="absolute bottom-0 right-0 bg-[#0088cc] text-white p-2 rounded-full shadow-md transform translate-x-1 translate-y-1 hover:bg-[#0077bb]">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Hotel Image</p>
                      <button className="text-[#0088cc] text-sm font-medium">Change Image</button>
                    </div>
                  </div>

                  {/* Hotel Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                    <input
                      type="text"
                      value={profileData.hotelName}
                      onChange={(e) => handleProfileChange('hotelName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Address with Google Places Autocomplete */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      id="location-search"
                      type="text"
                      value={profileData.address}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                      placeholder="Search for your hotel location"
                    />
                    {profileData.location && (
                      <p className="text-xs text-gray-500 mt-1">
                        Coordinates: {profileData.location.lat.toFixed(6)}, {profileData.location.lng.toFixed(6)}
                      </p>
                    )}
                  </div>

                  {/* Open 24/7 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="open247"
                        checked={profileData.open247}
                        onChange={(e) => handleProfileChange('open247', e.target.checked)}
                        className="w-4 h-4 text-[#0088cc] rounded focus:ring-[#0088cc]"
                      />
                      <label htmlFor="open247" className="text-sm text-gray-700">
                        Open 24/7
                      </label>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="wifi"
                          checked={profileData.amenities.wifi}
                          onChange={(e) => handleAmenityChange('wifi', e.target.checked)}
                          className="w-4 h-4 text-[#0088cc] rounded focus:ring-[#0088cc]"
                        />
                        <label htmlFor="wifi" className="text-sm text-gray-700 flex items-center">
                          <Wifi className="w-4 h-4 mr-1" /> Free WiFi
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="parking"
                          checked={profileData.amenities.parking}
                          onChange={(e) => handleAmenityChange('parking', e.target.checked)}
                          className="w-4 h-4 text-[#0088cc] rounded focus:ring-[#0088cc]"
                        />
                        <label htmlFor="parking" className="text-sm text-gray-700 flex items-center">
                          <ParkingSquare className="w-4 h-4 mr-1" /> Parking
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="restaurant"
                          checked={profileData.amenities.restaurant}
                          onChange={(e) => handleAmenityChange('restaurant', e.target.checked)}
                          className="w-4 h-4 text-[#0088cc] rounded focus:ring-[#0088cc]"
                        />
                        <label htmlFor="restaurant" className="text-sm text-gray-700 flex items-center">
                          <Utensils className="w-4 h-4 mr-1" /> Restaurant
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="spa"
                          checked={profileData.amenities.spa}
                          onChange={(e) => handleAmenityChange('spa', e.target.checked)}
                          className="w-4 h-4 text-[#0088cc] rounded focus:ring-[#0088cc]"
                        />
                        <label htmlFor="spa" className="text-sm text-gray-700 flex items-center">
                          <Coffee className="w-4 h-4 mr-1" /> Spa & Wellness
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="pool"
                          checked={profileData.amenities.pool}
                          onChange={(e) => handleAmenityChange('pool', e.target.checked)}
                          className="w-4 h-4 text-[#0088cc] rounded focus:ring-[#0088cc]"
                        />
                        <label htmlFor="pool" className="text-sm text-gray-700 flex items-center">
                          <Users className="w-4 h-4 mr-1" /> Swimming Pool
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="fitness"
                          checked={profileData.amenities.fitness}
                          onChange={(e) => handleAmenityChange('fitness', e.target.checked)}
                          className="w-4 h-4 text-[#0088cc] rounded focus:ring-[#0088cc]"
                        />
                        <label htmlFor="fitness" className="text-sm text-gray-700 flex items-center">
                          <Dumbbell className="w-4 h-4 mr-1" /> Fitness Center
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                    <textarea
                      value={profileData.description}
                      onChange={(e) => handleProfileChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={saveProfile}
                      className="bg-[#0088cc] text-white px-6 py-2 rounded-lg hover:bg-[#0077bb] transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column - Image */}
                    <div className="md:w-1/3">
                      <div className="relative">
                        <img 
                          src={profileImage} 
                          alt="Hotel" 
                          className="w-full h-48 md:h-64 rounded-lg object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                          <h3 className="text-white font-bold text-lg">{profileData.hotelName}</h3>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < profileData.starRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Details */}
                    <div className="md:w-2/3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-[#0088cc]" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-800">{profileData.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-[#0088cc]" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-800">{profileData.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-[#0088cc]" />
                          <div>
                            <p className="text-sm text-gray-600">Address</p>
                            <p className="font-medium text-gray-800">{profileData.address}</p>
                          </div>
                        </div>
                       
                      </div>
                      
                      {/* Google Maps Embed */}
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Location</p>
                        <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
                          {profileData.location && (
                            <iframe
                              title="Hotel Location"
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              style={{ border: 0 }}
                              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCFbprhDc_fKXUHl-oYEVGXKD1HciiAsz0&q=${profileData.location.lat},${profileData.location.lng}&zoom=15`}
                              allowFullScreen
                            ></iframe>
                          )}
                        </div>
                      </div>
                      
                      {/* Amenities */}
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-3">
                          {profileData.amenities.wifi && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                              <Wifi className="w-4 h-4 mr-1" /> Free WiFi
                            </span>
                          )}
                          {profileData.amenities.parking && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">
                              <ParkingSquare className="w-4 h-4 mr-1" /> Parking
                            </span>
                          )}
                          {profileData.amenities.restaurant && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm">
                              <Utensils className="w-4 h-4 mr-1" /> Restaurant
                            </span>
                          )}
                          {profileData.amenities.spa && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-sm">
                              <Coffee className="w-4 h-4 mr-1" /> Spa & Wellness
                            </span>
                          )}
                          {profileData.amenities.pool && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-sm">
                              <Users className="w-4 h-4 mr-1" /> Pool
                            </span>
                          )}
                          {profileData.amenities.fitness && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm">
                              <Dumbbell className="w-4 h-4 mr-1" /> Fitness Center
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">About</p>
                    <p className="text-gray-800">{profileData.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Security</h2>
                  <p className="text-gray-600">Manage your account security</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-[#0088cc]" />
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Change Password</p>
                      <p className="text-sm text-gray-600">Update your account password</p>
                    </div>
                  </div>
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cog className="w-5 h-5 text-[#0088cc]" />
                    <div>
                      <p className="font-medium text-gray-800">Account Status</p>
                      <p className="text-sm text-gray-600">Your account is active and verified</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-md border border-red-200">
            <div className="p-6 border-b border-red-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
                  <p className="text-red-600">Irreversible actions for your account</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!showDeleteSection ? (
                <button
                  onClick={() => setShowDeleteSection(true)}
                  className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="font-medium">Delete Account</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-red-800 mb-2">Are you absolutely sure?</h3>
                        <p className="text-sm text-red-700 mb-4">
                          This action cannot be undone. This will permanently delete your hotel account,
                          remove all your data, and cancel all active bookings.
                        </p>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-red-700 mb-2">
                              Type "DELETE" to confirm
                            </label>
                            <input
                              type="text"
                              value={deleteConfirmation}
                              onChange={(e) => setDeleteConfirmation(e.target.value)}
                              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:border-red-500 focus:outline-none"
                              placeholder="Type DELETE here"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowDeleteSection(false);
                        setDeleteConfirmation('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmation !== 'DELETE'}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        deleteConfirmation === 'DELETE'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert('Password updated successfully!');
                      setShowPasswordModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077bb] transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;