import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Upload, Calendar, DollarSign, Users, Eye, EyeOff, Star, MapPin, X } from 'lucide-react';
import Sidebar from '../../components/SidebarHotel';

const Promotions = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: "Summer Beach Getaway",
      description: "Enjoy 30% off on ocean view rooms with complimentary breakfast",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop",
      discount: 30,
      validFrom: "2025-06-01",
      validTo: "2025-08-31",
      isActive: true,
      views: 1250,
      bookings: 45
    },
    {
      id: 2,
      title: "Business Traveler Special",
      description: "15% discount for stays longer than 3 nights with free WiFi upgrade",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
      discount: 15,
      validFrom: "2025-07-01",
      validTo: "2025-12-31",
      isActive: true,
      views: 890,
      bookings: 23
    },
    {
      id: 3,
      title: "Weekend Spa Package",
      description: "Relax and unwind with our exclusive spa package including dinner",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop",
      discount: 25,
      validFrom: "2025-05-15",
      validTo: "2025-07-15",
      isActive: false,
      views: 567,
      bookings: 12
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    discount: '',
    validFrom: '',
    validTo: '',
    isActive: true
  });
  
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (promotion = null) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        title: promotion.title,
        description: promotion.description,
        image: promotion.image,
        discount: promotion.discount,
        validFrom: promotion.validFrom,
        validTo: promotion.validTo,
        isActive: promotion.isActive
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        discount: '',
        validFrom: '',
        validTo: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      discount: '',
      validFrom: '',
      validTo: '',
      isActive: true
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.discount || !formData.validFrom || !formData.validTo) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingPromotion) {
      // Update existing promotion
      setPromotions(prev => prev.map(promo => 
        promo.id === editingPromotion.id 
          ? { ...promo, ...formData }
          : promo
      ));
    } else {
      // Add new promotion
      const newPromotion = {
        id: Date.now(),
        ...formData,
        views: 0,
        bookings: 0
      };
      setPromotions(prev => [...prev, newPromotion]);
    }
    
    closeModal();
  };

  const togglePromotionStatus = (id) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };

  const deletePromotion = (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(prev => prev.filter(promo => promo.id !== id));
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Placeholder */}
      <Sidebar/>
      
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Promotions & Advertisements</h1>
              <p className="text-gray-600">Create and manage promotional offers for travelers</p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-[#0088cc] text-white px-6 py-3 rounded-lg hover:bg-[#0077bb] transition-colors flex items-center space-x-2 shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Create Promotion</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Promotions</p>
                  <p className="text-2xl font-bold text-gray-800">{promotions.length}</p>
                </div>
                <div className="bg-[#0088cc]/10 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-[#0088cc]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Offers</p>
                  <p className="text-2xl font-bold text-gray-800">{promotions.filter(p => p.isActive).length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Views</p>
                  <p className="text-2xl font-bold text-gray-800">{promotions.reduce((sum, p) => sum + p.views, 0)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{promotions.reduce((sum, p) => sum + p.bookings, 0)}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48">
                  <img 
                    src={promotion.image} 
                    alt={promotion.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      promotion.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {promotion.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#0088cc] text-white px-2 py-1 rounded-full text-sm font-bold">
                      {promotion.discount}% OFF
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{promotion.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{promotion.description}</p>
                  
                  {/* Date Range */}
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{promotion.validFrom} to {promotion.validTo}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{promotion.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{promotion.bookings} bookings</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(promotion)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => togglePromotionStatus(promotion.id)}
                      className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                        promotion.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {promotion.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{promotion.isActive ? 'Disable' : 'Enable'}</span>
                    </button>
                    <button
                      onClick={() => deletePromotion(promotion.id)}
                      className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                    placeholder="Enter promotion title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none resize-none"
                    placeholder="Describe your promotion"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Image</label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#0088cc] transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                    ) : (
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-gray-600">Click to upload image</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                      placeholder="0"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => handleInputChange('validFrom', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid To</label>
                    <input
                      type="date"
                      value={formData.validTo}
                      onChange={(e) => handleInputChange('validTo', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0088cc] focus:outline-none"
                      required
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
                    className="w-4 h-4 text-[#0088cc] border-gray-300 rounded focus:ring-[#0088cc]"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Make promotion active immediately
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077bb] transition-colors"
                  >
                    {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
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

export default Promotions;