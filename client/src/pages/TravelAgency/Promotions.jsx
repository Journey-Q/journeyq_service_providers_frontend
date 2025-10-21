import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Eye, EyeOff, Star, CreditCard, Check, Clock, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/SidebarTravelAgency';
import PaymentModal from './Payment';
import InsertEditPromotion from './InsertEditPromotion';
import PromotionService from '../../api_service/PromotionService';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPromotionForPayment, setSelectedPromotionForPayment] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);

  const serviceProvider = localStorage.getItem('serviceProvider');
  const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;

  // Fetch promotions from backend
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PromotionService.getPromotionsByServiceProviderId(serviceProviderId);
      setPromotions(data);
      setFilteredPromotions(data);
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

  // Apply filter whenever activeFilter or promotions change
  useEffect(() => {
    applyFilter(activeFilter);
  }, [activeFilter, promotions]);

  // Filter promotions by status
  const applyFilter = (filterType) => {
    let filtered = [...promotions];
    
    switch(filterType) {
      case 'advertised':
        filtered = promotions.filter(p => p.status?.toLowerCase() === 'advertised');
        break;
      case 'approved':
        filtered = promotions.filter(p => p.status?.toLowerCase() === 'approved');
        break;
      case 'pending':
        filtered = promotions.filter(p => p.status?.toLowerCase() === 'requested');
        break;
      case 'rejected':
        filtered = promotions.filter(p => p.status?.toLowerCase() === 'rejected');
        break;
      case 'all':
      default:
        filtered = promotions;
        break;
    }
    
    setFilteredPromotions(filtered);
  };

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
  const managedPromotions = filteredPromotions.filter(promotion => 
    promotion.status?.toLowerCase() === 'approved' || 
    promotion.status?.toLowerCase() === 'advertised'
  );

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (formData) => {
    try {
      const newPromotion = await PromotionService.createPromotion({
        ...formData,
        serviceProviderId: parseInt(serviceProviderId)
      });
      
      setPromotions(prev => [...prev, newPromotion]);
      alert('Promotion submitted for admin approval!');
      
      closeModal();
    } catch (err) {
      console.error('Error saving promotion:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const openPaymentModal = (promotion) => {
    setSelectedPromotionForPayment(promotion);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === paymentData.promotionId 
        ? { ...promo, status: 'ADVERTISED' } 
        : promo
    ));
    
    setShowPaymentModal(false);
    setSelectedPromotionForPayment(null);
    
    alert(`Payment successful! Your promotion is now being advertised with the ${paymentData.plan} plan.`);
  };

  const togglePromotionStatus = async (id) => {
    try {
      const promotion = promotions.find(p => p.id === id);
      const updatedStatus = !promotion.isActive;
      
      setPromotions(prev => prev.map(promo => 
        promo.id === id ? { ...promo, isActive: updatedStatus } : promo
      ));
      
    } catch (err) {
      console.error('Error toggling promotion status:', err);
      alert(`Error: ${err.message}`);
      fetchPromotions();
    }
  };

  const deletePromotion = async (id) => {
    setPromotionToDelete(id);
    setDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!promotionToDelete) return;
    
    try {
      setDeleting(promotionToDelete);
      
      await PromotionService.deletePromotion(promotionToDelete);
      
      setPromotions(prev => prev.filter(promo => promo.id !== promotionToDelete));
      setFilteredPromotions(prev => prev.filter(promo => promo.id !== promotionToDelete));
      
      alert('Promotion deleted successfully!');
    } catch (err) {
      console.error('Error deleting promotion:', err);
      alert(`Failed to delete promotion: ${err.message}`);
    } finally {
      setDeleting(null);
      setDeleteConfirmModal(false);
      setPromotionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmModal(false);
    setPromotionToDelete(null);
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
          <div className="flex justify-end items-center mb-8">
            <button
              onClick={openModal}
              className="bg-[#0B9ED9] text-white px-6 py-3 rounded-lg hover:bg-[#0077bb] transition-colors flex items-center space-x-2 shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Create Promotion</span>
            </button>
          </div>

          {/* Stats Overview with Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div 
              onClick={() => setActiveFilter('all')}
              className={`bg-white rounded-xl shadow-md p-6 border cursor-pointer transition-all ${
                activeFilter === 'all' ? 'border-[#0088cc] ring-2 ring-[#0088cc] ring-opacity-50' : 'border-gray-100 hover:border-[#0088cc]'
              }`}
            >
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

            <div 
              onClick={() => setActiveFilter('advertised')}
              className={`bg-white rounded-xl shadow-md p-6 border cursor-pointer transition-all ${
                activeFilter === 'advertised' ? 'border-green-600 ring-2 ring-green-600 ring-opacity-50' : 'border-gray-100 hover:border-green-600'
              }`}
            >
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

            <div 
              onClick={() => setActiveFilter('approved')}
              className={`bg-white rounded-xl shadow-md p-6 border cursor-pointer transition-all ${
                activeFilter === 'approved' ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-50' : 'border-gray-100 hover:border-blue-600'
              }`}
            >
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

            <div 
              onClick={() => setActiveFilter('pending')}
              className={`bg-white rounded-xl shadow-md p-6 border cursor-pointer transition-all ${
                activeFilter === 'pending' ? 'border-yellow-600 ring-2 ring-yellow-600 ring-opacity-50' : 'border-gray-100 hover:border-yellow-600'
              }`}
            >
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

            {rejectedPromotions.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      {rejectedPromotions.length} promotion{rejectedPromotions.length > 1 ? 's' : ''} rejected
                    </h3>
                    <p className="text-xs text-red-700 mt-1">
                      These promotions were not approved. You can create new ones.
                    </p>
                  </div>
                </div>
              </div>
            )}

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

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">My Promotions</h2>
            <p className="text-sm text-gray-600">
              {activeFilter === 'all' ? 'Manage your approved and advertised promotions' : 
               activeFilter === 'advertised' ? 'Currently advertised promotions' :
               activeFilter === 'approved' ? 'Approved promotions ready for advertising' :
               activeFilter === 'pending' ? 'Promotions awaiting approval' :
               'Rejected promotions'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managedPromotions.map((promotion) => (
              <div key={promotion.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
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

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{promotion.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{promotion.description}</p>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(promotion.validFrom)} to {formatDate(promotion.validTo)}</span>
                  </div>

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
                        disabled={deleting === promotion.id}
                        className={`bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors ${
                          deleting === promotion.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {deleting === promotion.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {managedPromotions.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeFilter === 'all' ? 'No approved promotions yet' :
                 activeFilter === 'advertised' ? 'No advertised promotions' :
                 activeFilter === 'approved' ? 'No approved promotions' :
                 activeFilter === 'pending' ? 'No pending promotions' :
                 'No rejected promotions'}
              </h3>
              <p className="text-gray-500 mb-4">
                {activeFilter === 'all' ? 'Create your first promotion and wait for admin approval to get started.' :
                 'No promotions in this category.'}
              </p>
              {activeFilter === 'all' && (
                <button
                  onClick={openModal}
                  className="bg-[#0088cc] text-white px-4 py-2 rounded-lg hover:bg-[#0077bb] transition-colors"
                >
                  Create Your First Promotion
                </button>
              )}
            </div>
          )}
        </div>

        <InsertEditPromotion
          showModal={showModal}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
        />

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPromotionForPayment(null);
          }}
          promotion={selectedPromotionForPayment}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirmModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Delete Promotion?
                </h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Are you sure you want to delete this promotion? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
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