import React, { useState, useRef } from 'react';
import {
  Plus, Edit2, Trash2, Car, Clock, Check, AlertCircle,
  Upload, Calendar, Eye, EyeOff, X
} from 'lucide-react';
import Sidebar from '../../components/SidebarTravelAgency';

const VehiclePromotions = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: "Luxury Van Special",
      description: "Premium van rental with driver for city tours",
      vehicleType: "Van",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwaGlhY2V8ZW58MHx8MHx8fDA%3D",
      discount: 15,
      validFrom: "2025-07-15",
      validTo: "2025-08-30",
      isActive: true,
      status: "approved",
      capacity: 12,
      ac: true
    },
    {
      id: 2,
      title: "Weekend SUV Deal",
      description: "Comfortable SUV rentals for weekend getaways",
      vehicleType: "SUV",
      image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlzc2FuJTIwc3V2fGVufDB8fDB8fHww",
      discount: 20,
      validFrom: "2025-08-01",
      validTo: "2025-09-15",
      isActive: false,
      status: "advertised",
      capacity: 7,
      ac: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vehicleType: 'Van',
    image: '',
    discount: '',
    validFrom: '',
    validTo: '',
    isActive: true,
    capacity: '',
    ac: true
  });
  const fileInputRef = useRef(null);

  const openModal = (promo = null) => {
    setEditingPromotion(promo);
    setFormData(promo ? { ...promo } : {
      title: '', description: '', vehicleType: 'Van', image: '', 
      discount: '', validFrom: '', validTo: '', isActive: true,
      capacity: '', ac: true
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
    setFormData({
      title: '', description: '', vehicleType: 'Van', image: '', 
      discount: '', validFrom: '', validTo: '', isActive: true,
      capacity: '', ac: true
    });
  };

  const handleSubmit = () => {
    if (editingPromotion) {
      setPromotions(prev => prev.map(p => p.id === editingPromotion.id ? { ...p, ...formData } : p));
    } else {
      setPromotions(prev => [...prev, { 
        id: Date.now(), 
        ...formData, 
        status: 'requested',
        discount: parseInt(formData.discount),
        capacity: parseInt(formData.capacity)
      }]);
    }
    closeModal();
  };

  const deletePromotion = id => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(prev => prev.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'advertised': return 'bg-green-100 text-green-800';
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Vehicle Promotions</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
            onClick={() => openModal()}
          >
            <Plus size={18} /> Add Vehicle Promotion
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Total Promotions</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{promotions.length}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {promotions.filter(p => p.isActive).length}
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {promotions.filter(p => p.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">
              {promotions.filter(p => p.status === 'requested').length}
            </p>
          </div>
        </div>

        {/* Status Messages */}
        <div className="space-y-4 mb-6">
          {promotions.filter(p => p.status === 'requested').length > 0 && (
            <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-4 py-3 rounded-lg flex items-start space-x-2">
              <Clock className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">
                  {promotions.filter(p => p.status === 'requested').length} promotion awaiting approval
                </p>
                <p className="text-sm">Your submitted promotions will appear below once approved.</p>
              </div>
            </div>
          )}
          {promotions.filter(p => p.status === 'rejected').length > 0 && (
            <div className="bg-red-100 text-red-800 border border-red-200 px-4 py-3 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">
                  {promotions.filter(p => p.status === 'rejected').length} promotions rejected
                </p>
                <p className="text-sm">These promotions were not approved. You can edit and resubmit them.</p>
              </div>
            </div>
          )}
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map(promo => (
            <div key={promo.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="relative">
                <img src={promo.image} className="h-48 w-full object-cover" alt={promo.title} />
                <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${getStatusColor(promo.status)}`}>
                  {promo.status}
                </span>
                {promo.isActive && (
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{promo.title}</h3>
                  <div className="flex items-center gap-1">
                    <Car size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500">{promo.vehicleType}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{promo.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar size={14} className="mr-1" />
                  {promo.validFrom} to {promo.validTo}
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">
                    <span className="text-blue-600">{promo.discount}% OFF</span>
                  </span>
                  <span className="text-sm">
                    Capacity: <span className="font-medium">{promo.capacity}</span> | 
                    AC: {promo.ac ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between border-t pt-3">
                  <button 
                    onClick={() => openModal(promo)} 
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Edit2 size={16} className="mr-1" /> Edit
                  </button>
                  <button 
                    onClick={() => deletePromotion(promo.id)} 
                    className="text-red-600 hover:text-red-800 text-sm flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-bold">
                  {editingPromotion ? 'Edit' : 'Create'} Vehicle Promotion
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Title*</label>
                  <input
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Promotion title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Vehicle Type*</label>
                  <select
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.vehicleType}
                    onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                  >
                    <option value="Van">Van</option>
                    <option value="SUV">SUV</option>
                    <option value="Car">Car</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description*</label>
                <textarea
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Promotion details"
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Vehicle Image</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="border px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Upload size={16} /> Upload Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={e => {
                      if (e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = () => setFormData({ ...formData, image: reader.result });
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                  {formData.image && (
                    <img src={formData.image} className="h-12 w-12 object-cover rounded" alt="Preview" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Discount %*</label>
                  <input
                    type="number"
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10"
                    value={formData.discount}
                    onChange={e => setFormData({ ...formData, discount: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Capacity*</label>
                  <input
                    type="number"
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="4"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>

                <div className="space-y-2 flex items-center">
                  <input
                    type="checkbox"
                    id="ac"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.ac}
                    onChange={e => setFormData({ ...formData, ac: e.target.checked })}
                  />
                  <label htmlFor="ac" className="ml-2 block text-sm text-gray-700">
                    Air Conditioning
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Valid From*</label>
                  <input
                    type="date"
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.validFrom}
                    onChange={e => setFormData({ ...formData, validFrom: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Valid To*</label>
                  <input
                    type="date"
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.validTo}
                    onChange={e => setFormData({ ...formData, validTo: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  onClick={closeModal} 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclePromotions;