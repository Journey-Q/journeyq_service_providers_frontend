import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Upload, Calendar, Eye, EyeOff, Star, X, Check, Clock, CreditCard, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/SidebarTravelAgency';
import PaymentModal from './Payment'; // Import the payment modal

const Promotions = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: "Toyota Hiace Super GL",
      description: "Explore ancient ruins and sacred temples in the heart of Sri Lanka's first kingdom.",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwaGlhY2V8ZW58MHx8MHx8fDA%3D",
      discount: 30,
      validFrom: "2025-06-01",
      validTo: "2025-08-31",
      isActive: true,
      status: "advertised",
    },
    {
      id: 2,
      title: "Nissan Sunny",
      description: "Discover Sri Lanka’s iconic rock fortress and marvel at the stunning cave temple art.",
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlzc2FuJTIwc3Vubnl8ZW58MHx8MHx8fDA%3D",
      discount: 15,
      validFrom: "2025-07-01",
      validTo: "2025-12-31",
      isActive: true,
      status: "advertised",
    },
    {
      id: 3,
      title: "Luxury Coach",
      description: "Enjoy serene boat rides and uncover the cultural charm of Batticaloa’s lagoon-side heritage.",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bHV4dXJ5JTIwYnVzfGVufDB8fDB8fHww",
      discount: 25,
      validFrom: "2025-05-15",
      validTo: "2025-07-15",
      isActive: false,
      status: "approved",
    },
    {
      id: 4,
      title: "Luxury Coach",
      description: "Set sail into the Indian Ocean for a thrilling encounter with majestic blue whales off the coast of Mirissa.",
      image: "https://images.unsplash.com/photo-1475318681864-ef1966c3cbb7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      discount: 20,
      validFrom: "2025-12-01",
      validTo: "2025-12-31",
      isActive: true,
      status: "approved",
    },
    {
      id: 5,
      title: "Early Bird Special",
      description: "Book 30 days in advance and save big on your stay",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=250&fit=crop",
      discount: 35,
      validFrom: "2025-08-01",
      validTo: "2025-09-30",
      isActive: false,
      status: "requested",
    },
    {
      id: 6,
      title: "Corporate Event Package",
      description: "Special rates for corporate events and conferences",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop",
      discount: 18,
      validFrom: "2025-10-01",
      validTo: "2025-11-30",
      isActive: false,
      status: "rejected",
    },
    {
      id: 7,
      title: "Anniversary Celebration",
      description: "Celebrate your special day with our romantic package",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
      discount: 40,
      validFrom: "2025-02-01",
      validTo: "2025-02-28",
      isActive: false,
      status: "rejected",
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPromotionForPayment, setSelectedPromotionForPayment] = useState(null);
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

  // Filter promotions by status
  const approvedPromotions = promotions.filter(promotion => promotion.status === 'approved');
  const advertisedPromotions = promotions.filter(promotion => promotion.status === 'advertised');
  const requestedPromotions = promotions.filter(promotion => promotion.status === 'requested');
  const rejectedPromotions = promotions.filter(promotion => promotion.status === 'rejected');

  // Combined approved and advertised for display
  const managedPromotions = promotions.filter(promotion => 
    promotion.status === 'approved' || promotion.status === 'advertised'
  );

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
      // Add new promotion (always starts as "requested" - waiting for admin approval)
      const newPromotion = {
        id: Date.now(),
        ...formData,
        status: 'requested'
      };
      setPromotions(prev => [...prev, newPromotion]);
      alert('Promotion submitted for admin approval!');
    }
    
    closeModal();
  };

  // Open payment modal
  const openPaymentModal = (promotion) => {
    setSelectedPromotionForPayment(promotion);
    setShowPaymentModal(true);
  };

  // Handle successful payment
  const handlePaymentSuccess = (paymentData) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === paymentData.promotionId 
        ? { ...promo, status: 'advertised' } 
        : promo
    ));
    
    setShowPaymentModal(false);
    setSelectedPromotionForPayment(null);
    
    // Show success message
    alert(`Payment successful! Your promotion is now being advertised with the ${paymentData.plan} plan.`);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'advertised':
        return 'bg-green-100 text-green-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'advertised':
        return 'Advertised';
      case 'requested':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar/>
      
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-end items-center mb-8">
            <button
              onClick={() => openModal()}
              className="bg-[#0B9ED9] text-white px-6 py-3 rounded-lg hover:bg-[#0077bb] transition-colors flex items-center space-x-2 shadow-md"
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
                  <p className="text-gray-600 text-sm font-medium">Advertised</p>
                  <p className="text-2xl font-bold text-gray-800">{advertisedPromotions.length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Approved</p>
                  <p className="text-2xl font-bold text-gray-800">{approvedPromotions.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-gray-800">{requestedPromotions.length}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Status Notices */}
          <div className="space-y-4 mb-6">
            {/* Pending Approval Notice */}
            {requestedPromotions.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      {requestedPromotions.length} promotion{requestedPromotions.length > 1 ? 's' : ''} awaiting admin approval
                    </h3>
                    <p className="text-xs text-yellow-700 mt-1">
                      Your submitted promotions will appear below once approved by the administrator.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rejected Notice */}
            {rejectedPromotions.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      {rejectedPromotions.length} promotion{rejectedPromotions.length > 1 ? 's' : ''} rejected
                    </h3>
                    <p className="text-xs text-red-700 mt-1">
                      These promotions were not approved. You can edit and resubmit them.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Approved Notice */}
            {approvedPromotions.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">
                      {approvedPromotions.length} promotion{approvedPromotions.length > 1 ? 's' : ''} ready for advertising
                    </h3>
                    <p className="text-xs text-blue-700 mt-1">
                      These promotions are approved. Pay to advertise them and start getting bookings!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section Title */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">My Promotions</h2>
            <p className="text-sm text-gray-600">Manage your approved and advertised promotions</p>
          </div>

          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managedPromotions.map((promotion) => (
              <div key={promotion.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48">
                  <img 
                    src={promotion.image} 
                    alt={promotion.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promotion.status)}`}>
                      {getStatusLabel(promotion.status)}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#0088cc] text-white px-2 py-1 rounded-full text-sm font-bold">
                      {promotion.discount}% OFF
                    </span>
                  </div>
                  {promotion.status === 'advertised' && (
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <CreditCard className="w-3 h-3" />
                        <span>Live Ad</span>
                      </span>
                    </div>
                  )}
                  {promotion.isActive && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                  )}
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

                  {/* Actions based on status */}
                  <div className="space-y-2">
                    {promotion.status === 'approved' && (
                      <button
                        onClick={() => openPaymentModal(promotion)}
                        className="w-full bg-[#0088cc] text-white px-3 py-2 rounded-lg hover:bg-[#0077bb] transition-colors flex items-center justify-center space-x-1 font-medium"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay to Advertise</span>
                      </button>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(promotion)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      {promotion.status === 'advertised' && (
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
                      )}
                      <button
                        onClick={() => deletePromotion(promotion.id)}
                        className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {managedPromotions.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No approved promotions yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first promotion and wait for admin approval to get started.
              </p>
              <button
                onClick={() => openModal()}
                className="bg-[#0088cc] text-white px-4 py-2 rounded-lg hover:bg-[#0077bb] transition-colors"
              >
                Create Your First Promotion
              </button>
            </div>
          )}
        </div>

        {/* Create/Edit Promotion Modal */}
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
                    Make promotion active immediately (after approval)
                  </label>
                </div>

                {/* Info Message */}
                {!editingPromotion && (
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
                )}

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
                    {editingPromotion ? 'Update Promotion' : 'Submit for Approval'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPromotionForPayment(null);
          }}
          promotion={selectedPromotionForPayment}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default Promotions;