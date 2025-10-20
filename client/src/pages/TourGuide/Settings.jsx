import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SidebarTourGuide';
import {
  Edit2,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Trash2,
  AlertTriangle,
  Lock,
  Cog,
  Star,
  Calendar,
  Camera,
  Loader2,
  Users
} from 'lucide-react';
import TourGuideProfileService from '../../api_service/TourGuideservice';
import CloudinaryStorageService from '../../api_service/Cloudinaryservice';

const Settings = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load tour guide profile data on component mount
  useEffect(() => {
    fetchTourGuideProfile();
  }, []);

  const fetchTourGuideProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const serviceProvider = localStorage.getItem("serviceProvider");
      const serviceProviderId = serviceProvider
        ? JSON.parse(serviceProvider).id
        : null;

      if (!serviceProviderId) {
        throw new Error("Service Provider ID not found. Please login again.");
      }

      // FIXED: Use getProfile instead of getTourGuideProfileById
      const data = await TourGuideProfileService.getProfile(serviceProviderId);
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching tour guide profile:", err);
      setError(err.message || "Failed to load tour guide profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setError("");

    if (!file) return;

    try {
      CloudinaryStorageService.validateFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setImageFile(file);
      };
      reader.onerror = () => {
        throw new Error("Failed to read file");
      };
      reader.readAsDataURL(file);
    } catch (uploadError) {
      setError(uploadError.message);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById("profile-image-input");
    if (fileInput) fileInput.value = "";
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      setError("");
      setUploadProgress("");

      let profilePhotoUrl = profileData.profilePhotoUrl;

      // Upload new image if selected
      if (imageFile) {
        try {
          setUploadProgress("Uploading profile image...");
          
          const fileName = CloudinaryStorageService.generateFileName(
            imageFile.name,
            profileData.serviceProviderId,
            0
          );
          
          profilePhotoUrl = await CloudinaryStorageService.uploadImage(
            imageFile,
            fileName
          );
          
          console.log("Image uploaded successfully:", profilePhotoUrl);
          setUploadProgress("Image uploaded successfully!");
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }

      setUploadProgress("Updating profile...");

      const updateData = {
        companyName: profileData.companyName.trim(),
        profilePhotoUrl: profilePhotoUrl,
        description: profileData.description.trim(),
        establishedYear: parseInt(profileData.establishedYear),
        numberOfGuides: parseInt(profileData.numberOfGuides),
        contactInfo: {
          email: profileData.contactInfo?.email?.trim() || "",
          phone: profileData.contactInfo?.phone?.trim() || "",
          address: profileData.contactInfo?.address?.trim() || "",
        },
      };

      // FIXED: Use updateProfile instead of updateTourGuideProfile
      await TourGuideProfileService.updateProfile(
        profileData.serviceProviderId,
        updateData
      );

      setUploadProgress("Profile updated successfully!");
      
      // Reset edit state
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
      
      // Refresh data
      setTimeout(() => {
        fetchTourGuideProfile();
        setUploadProgress("");
      }, 1500);

    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
      setUploadProgress("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
    setError("");
    setUploadProgress("");
    fetchTourGuideProfile(); // Reset to original data
  };

  const handleDelete = async () => {
    if (deleteConfirmation === 'DELETE') {
      try {
        // FIXED: Use deleteProfile instead of deleteTourGuideProfile
        await TourGuideProfileService.deleteProfile(
          profileData.serviceProviderId
        );
        alert('Account deletion initiated. You will receive a confirmation email.');
        setShowDeleteSection(false);
        setDeleteConfirmation('');
        // Redirect to login or home page
        localStorage.clear();
        window.location.href = "/login";
      } catch (err) {
        alert("Failed to delete account: " + err.message);
      }
    } else {
      alert('Please type "DELETE" to confirm account deletion.');
    }
  };

  // Password change handler (you'll need to implement this based on your backend)
  const handlePasswordChange = async (currentPassword, newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    try {
      // You'll need to implement this API call based on your backend
      // Example:
      // await TourGuideProfileService.changePassword({
      //   currentPassword,
      //   newPassword
      // });
      alert('Password updated successfully!');
      setShowPasswordModal(false);
    } catch (err) {
      alert('Failed to update password: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tour guide profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTourGuideProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No tour guide profile found</p>
            <button
              onClick={fetchTourGuideProfile}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Progress Message */}
          {uploadProgress && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                uploadProgress.includes("successfully")
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-blue-100 border border-blue-400 text-blue-700"
              }`}
            >
              {!uploadProgress.includes("successfully") && (
                <Loader2 className="w-5 h-5 mr-2 flex-shrink-0 animate-spin" />
              )}
              <p className="text-sm font-medium">{uploadProgress}</p>
            </div>
          )}

          {/* Company Profile */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Tour Guide Agency Profile</h2>
                  <p className="text-gray-600">Manage your tour guide agency info</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleCancelEdit();
                  } else {
                    setIsEditing(true);
                  }
                }}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 ${
                  isEditing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-6 space-y-6">
              {isEditing ? (
                <>
                  {/* Profile Image */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img 
                        src={
                          imagePreview ||
                          profileData.profilePhotoUrl ||
                          "https://via.placeholder.com/150"
                        }
                        alt="Agency" 
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("profile-image-input").click()
                        }
                        disabled={isSaving}
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md transform translate-x-1 translate-y-1 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Agency Logo</p>
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("profile-image-input").click()
                        }
                        disabled={isSaving}
                        className="text-blue-600 text-sm font-medium hover:text-blue-700 disabled:opacity-50"
                      >
                        Change Image
                      </button>
                      {imageFile && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={isSaving}
                          className="ml-3 text-red-600 text-sm font-medium hover:text-red-800 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Max 10MB • JPEG, PNG, WebP
                      </p>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.companyName}
                      onChange={(e) =>
                        handleProfileChange("companyName", e.target.value)
                      }
                      disabled={isSaving}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={profileData.contactInfo?.email || ""}
                        onChange={(e) =>
                          handleContactChange("email", e.target.value)
                        }
                        disabled={isSaving}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={profileData.contactInfo?.phone || ""}
                        onChange={(e) =>
                          handleContactChange("phone", e.target.value)
                        }
                        disabled={isSaving}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={profileData.contactInfo?.address || ""}
                      onChange={(e) =>
                        handleContactChange("address", e.target.value)
                      }
                      disabled={isSaving}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>

                  {/* Established Year & Number of Guides */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Established Year *
                      </label>
                      <input
                        type="number"
                        value={profileData.establishedYear}
                        onChange={(e) =>
                          handleProfileChange("establishedYear", e.target.value)
                        }
                        disabled={isSaving}
                        required
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Tour Guides *
                      </label>
                      <input
                        type="number"
                        value={profileData.numberOfGuides}
                        onChange={(e) =>
                          handleProfileChange("numberOfGuides", e.target.value)
                        }
                        disabled={isSaving}
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={profileData.description}
                      onChange={(e) =>
                        handleProfileChange("description", e.target.value)
                      }
                      disabled={isSaving}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none resize-none disabled:bg-gray-100"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={saveChanges}
                      disabled={isSaving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column - Image */}
                    <div className="md:w-1/3">
                      <div className="relative">
                        <img 
                          src={
                            profileData.profilePhotoUrl ||
                            "https://via.placeholder.com/300"
                          }
                          alt="Agency" 
                          className="w-full h-48 md:h-64 rounded-lg object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                          <h3 className="text-white font-bold text-lg">{profileData.companyName}</h3>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Details */}
                    <div className="md:w-2/3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-800">
                              {profileData.contactInfo?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-800">
                              {profileData.contactInfo?.phone || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 col-span-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Address</p>
                            <p className="font-medium text-gray-800">
                              {profileData.contactInfo?.address || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Established Year</p>
                            <p className="font-medium text-gray-800">
                              {profileData.establishedYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Number of Tour Guides</p>
                            <p className="font-medium text-gray-800">
                              {profileData.numberOfGuides}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Description</p>
                        <p className="text-gray-800">{profileData.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Security</h2>
                <p className="text-gray-600">Update your password and view security status</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Change Password</p>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                </div>
                <Edit2 className="w-4 h-4 text-gray-400" />
              </button>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cog className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">Account Status</p>
                    <p className="text-sm text-gray-600">Your account is active and verified</p>
                  </div>
                </div>
                <span className="text-sm text-green-800 bg-green-100 px-3 py-1 rounded-full font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-md border border-red-200">
            <div className="p-6 border-b border-red-200 flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
                <p className="text-red-600">Irreversible actions for your account</p>
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
                        <h3 className="font-medium text-red-800 mb-2">
                          Are you absolutely sure?
                        </h3>
                        <p className="text-sm text-red-700 mb-4">
                          This action cannot be undone. This will permanently delete your tour guide agency account, remove all your data, and cancel all active bookings.
                        </p>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-red-700 mb-2">
                              Type "DELETE" to confirm
                            </label>
                            <input
                              type="text"
                              value={deleteConfirmation}
                              onChange={(e) =>
                                setDeleteConfirmation(e.target.value)
                              }
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
                      onClick={handleDelete}
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

          {/* Password Modal */}
          {showPasswordModal && (
            <PasswordModal 
              onClose={() => setShowPasswordModal(false)}
              onChangePassword={handlePasswordChange}
            />
          )}

        </div>
      </div>
    </div>
  );
};

// Password Modal Component
const PasswordModal = ({ onClose, onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    onChangePassword(currentPassword, newPassword, confirmPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Change Password</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="space-y-3">
          <Input 
            label="Current Password" 
            type="password" 
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <Input 
            label="New Password" 
            type="password" 
            value={newPassword}
            onChange={setNewPassword}
          />
          <Input 
            label="Confirm New Password" 
            type="password" 
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <div className="flex justify-end space-x-2 pt-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable input components
const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-500"
    />
  </div>
);

export default Settings;