import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Eye, EyeOff, Star, CreditCard, Check, Clock, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/SidebarTourGuide';
import PaymentModal from './Payment';
import InsertEditPromotion from './InsertEditPromotion';
import PromotionService from '../../api_service/PromotionService';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPromotionForPayment, setSelectedPromotionForPayment] = useState(null);
  const [editingPromotion, setEditingPromotion] = useState(null);

  // Get service provider ID from localStorage or context (adjust based on your auth setup)
  const serviceProviderId = localStorage.getItem('serviceProviderId') || '33'; // Fallback to 33 for demo

  // Fetch promotions from backend
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PromotionService.getPromotionsByServiceProviderId(serviceProviderId);
      setPromotions(data);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [serviceProviderId]);

  // Filter promotions by status (convert backend status to lowercase for compatibility)
  const approvedPromotions = promotions.filter(promotion => 
    promotion.status?.toLowerCase() === 'approved'
  );
  const advertisedPromotions = promotions.filter(promotion => 
    promotion.status?.toLowerCase() === 'advertised'
  );
  const requestedPromotions = promotions.filter(promotion => 
    promotion.status?.toLowerCase() === 'requested'
  );
  const rejectedPromotions = promotions.filter(promotion => 
    promotion.status?.toLowerCase() === 'rejected'
  );

  // Combined approved and advertised for display
  const managedPromotions = promotions.filter(promotion => 
    promotion.status?.toLowerCase() === 'approved' || 
    promotion.status?.toLowerCase() === 'advertised'
  );

  const openModal = (promotion = null) => {
    setEditingPromotion(promotion);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
  };

  const handleSubmit = async (formData, isEditing) => {
    try {
      if (isEditing) {
        // Update existing promotion - you'll need to implement update in your service
        // For now, we'll delete and create new (replace with proper update when available)
        await PromotionService.deletePromotion(editingPromotion.id);
        const newPromotion = await PromotionService.createPromotion({
          ...formData,
          serviceProviderId: parseInt(serviceProviderId)
        });
        
        setPromotions(prev => prev.map(promo => 
          promo.id === editingPromotion.id ? newPromotion : promo
        ));
        
        alert('Promotion updated successfully!');
      } else {
        // Add new promotion
        const newPromotion = await PromotionService.createPromotion({
          ...formData,
          serviceProviderId: parseInt(serviceProviderId)
        });
        
        setPromotions(prev => [...prev, newPromotion]);
        alert('Promotion submitted for admin approval!');
      }
      
      closeModal();
    } catch (err) {
      console.error('Error saving promotion:', err);
      alert(`Error: ${err.message}`);
    }
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
        ? { ...promo, status: 'ADVERTISED' } 
        : promo
    ));
    
    setShowPaymentModal(false);
    setSelectedPromotionForPayment(null);
    
    // Show success message
    alert(`Payment successful! Your promotion is now being advertised with the ${paymentData.plan} plan.`);
  };

  const togglePromotionStatus = async (id) => {
    try {
      // Find the promotion to toggle
      const promotion = promotions.find(p => p.id === id);
      const updatedStatus = !promotion.isActive;
      
      // You'll need to implement an update endpoint in your service
      // For now, we'll just update locally
      setPromotions(prev => prev.map(promo => 
        promo.id === id ? { ...promo, isActive: updatedStatus } : promo
      ));
      
      // If you had an update endpoint, you would call it here:
      // await PromotionService.updatePromotion(id, { isActive: updatedStatus });
      
    } catch (err) {
      console.error('Error toggling promotion status:', err);
      alert(`Error: ${err.message}`);
      // Revert on error
      fetchPromotions();
    }
  };

  const deletePromotion = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await PromotionService.deletePromotion(id);
        setPromotions(prev => prev.filter(promo => promo.id !== id));
        alert('Promotion deleted successfully!');
      } catch (err) {
        console.error('Error deleting promotion:', err);
        alert(`Error: ${err.message}`);
      }
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
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
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
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

  // Format date for display (remove time part if present)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar/>
        <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0088cc] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading promotions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar/>
        <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading promotions</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchPromotions}
              className="bg-[#0088cc] text-white px-4 py-2 rounded-lg hover:bg-[#0077bb] transition-colors"
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
                  {promotion.status?.toLowerCase() === 'advertised' && (
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
                    <span>{formatDate(promotion.validFrom)} to {formatDate(promotion.validTo)}</span>
                  </div>

                  {/* Actions based on status */}
                  <div className="space-y-2">
                    {promotion.status?.toLowerCase() === 'approved' && (
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
                      {promotion.status?.toLowerCase() === 'advertised' && (
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
        <InsertEditPromotion
          showModal={showModal}
          closeModal={closeModal}
          editingPromotion={editingPromotion}
          handleSubmit={handleSubmit}
        />

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