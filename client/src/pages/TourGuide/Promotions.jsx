import React, { useState, useRef } from 'react';
import {
  Plus, Edit2, Trash2, CreditCard, Clock, Check, AlertCircle,
  Upload, Calendar, Eye, EyeOff
} from 'lucide-react';
import Sidebar from '../../components/SidebarTourGuide';
import PaymentModal from './Payment'; // Reuse same modal

const Promotions = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: "Sigiriya Cultural Visit",
      description: "Explore the Lion Rock fortress with a local guide and village lunch.",
      image: "https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2lnaXJpeWF8ZW58MHx8MHx8fDA%3D",
      discount: 20,
      validFrom: "2025-07-15",
      validTo: "2025-08-30",
      isActive: true,
      status: "approved",
    },
    {
      id: 2,
      title: "Ella Hiking Tour",
      description: "Trek through Little Adam's Peak and Nine Arches Bridge with transport.",
      image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxsYXxlbnwwfHwwfHx8MA%3D%3D",
      discount: 15,
      validFrom: "2025-08-01",
      validTo: "2025-09-15",
      isActive: false,
      status: "advertised",
    }
    // ... more dummy data
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

  const openModal = (promo = null) => {
    setEditingPromotion(promo);
    setFormData(promo ? { ...promo } : {
      title: '', description: '', image: '', discount: '', validFrom: '', validTo: '', isActive: true
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
    setFormData({
      title: '', description: '', image: '', discount: '', validFrom: '', validTo: '', isActive: true
    });
  };

  const handleSubmit = () => {
    if (editingPromotion) {
      setPromotions(prev => prev.map(p => p.id === editingPromotion.id ? { ...p, ...formData } : p));
    } else {
      setPromotions(prev => [...prev, { id: Date.now(), ...formData, status: 'requested' }]);
    }
    closeModal();
  };

  const deletePromotion = id => {
    if (confirm('Are you sure?')) {
      setPromotions(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-end mb-6">
          <button
            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded flex items-center gap-2"
            onClick={() => openModal()}
          >
            <Plus size={18} /> Add Tour Promotion
          </button>
        </div>

{/* Stats Overview */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  <div className="bg-white shadow rounded-xl p-4 text-center">
    <p className="text-sm text-gray-500">Total Promotions</p>
    <p className="text-3xl font-bold text-gray-800 mt-1">{promotions.length}</p>
  </div>
  <div className="bg-white shadow rounded-xl p-4 text-center">
    <p className="text-sm text-gray-500">Advertised</p>
    <p className="text-3xl font-bold text-green-600 mt-1">
      {promotions.filter(p => p.status === 'advertised').length}
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
          {promotions.filter(p => p.status === 'requested').length} promotion awaiting admin approval
        </p>
        <p className="text-sm">Your submitted promotions will appear below once approved by the administrator.</p>
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
  {promotions.filter(p => p.status === 'approved').length > 0 && (
    <div className="bg-blue-100 text-blue-800 border border-blue-200 px-4 py-3 rounded-lg flex items-start space-x-2">
      <Check className="w-5 h-5 mt-0.5" />
      <div>
        <p className="font-medium">
          {promotions.filter(p => p.status === 'approved').length} promotions ready for advertising
        </p>
        <p className="text-sm">These promotions are approved. Pay to advertise them and start getting bookings!</p>
      </div>
    </div>
  )}
</div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">







          
          {promotions.map(promo => (
            <div key={promo.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img src={promo.image} className="h-48 w-full object-cover" alt={promo.title} />
              <div className="p-4">
                <h3 className="text-lg font-bold">{promo.title}</h3>
                <p className="text-sm text-gray-600">{promo.description}</p>
                <p className="text-xs text-gray-500 my-2">
                  <Calendar size={14} className="inline" /> {promo.validFrom} to {promo.validTo}
                </p>
                <p className="text-sm font-semibold text-sky-600">{promo.discount}% OFF</p>
                <div className="flex justify-between mt-4">
                  <button onClick={() => openModal(promo)} className="text-sky-600 hover:underline text-sm">
                    <Edit2 size={16} className="inline" /> Edit
                  </button>
                  <button onClick={() => deletePromotion(promo.id)} className="text-red-600 hover:underline text-sm">
                    <Trash2 size={16} className="inline" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingPromotion ? 'Edit' : 'New'} Promotion</h2>
                <button onClick={closeModal}><X size={20} /></button>
              </div>

              <input
                className="w-full border px-4 py-2 rounded"
                placeholder="Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              <textarea
                className="w-full border px-4 py-2 rounded"
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={e => {
                  const reader = new FileReader();
                  reader.onload = () => setFormData({ ...formData, image: reader.result });
                  reader.readAsDataURL(e.target.files[0]);
                }}
              />
              <input
                type="number"
                className="w-full border px-4 py-2 rounded"
                placeholder="Discount %"
                value={formData.discount}
                onChange={e => setFormData({ ...formData, discount: e.target.value })}
              />
              <div className="flex gap-4">
                <input
                  type="date"
                  className="flex-1 border px-4 py-2 rounded"
                  value={formData.validFrom}
                  onChange={e => setFormData({ ...formData, validFrom: e.target.value })}
                />
                <input
                  type="date"
                  className="flex-1 border px-4 py-2 rounded"
                  value={formData.validTo}
                  onChange={e => setFormData({ ...formData, validTo: e.target.value })}
                />
              </div>

              <div className="flex gap-4 justify-end">
                <button onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">
                  {editingPromotion ? 'Update' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Promotions;
