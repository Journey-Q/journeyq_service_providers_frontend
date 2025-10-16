import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SidebarHotel';
import RoomService from '../../api_service/RoomService'; // Adjust path as needed
import InsertRoom from './InsertRoom'; // Import the new component

const RoomServicePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get service provider ID from localStorage or context
  const serviceProvider = localStorage.getItem('serviceProvider');
  const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    maxOccupancy: '1',
    area: '',
    bedType: 'Single',
    numberOfBeds: '1',
    bathrooms: '1',
    amenities: '',
    status: 'available',
    image: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const statusColors = {
    available: "bg-green-100 text-green-800",
    occupied: "bg-red-100 text-red-800",
    maintenance: "bg-yellow-100 text-yellow-800"
  };

  const statusLabels = {
    available: "Available",
    occupied: "Occupied",
    maintenance: "Maintenance"
  };

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!serviceProviderId) {
        throw new Error('Service Provider ID not found. Please login again.');
      }

      const data = await RoomService.getRoomsByServiceProviderId(serviceProviderId);
      
      // Transform API data to match UI format if needed
      const transformedRooms = data.map(room => ({
        id: room.id || room.roomId,
        name: room.roomName || room.name,
        image: room.imageUrl || room.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        price: room.pricePerNight || room.price,
        maxOccupancy: room.maxOccupancy,
        area: room.area || room.roomArea,
        beds: room.bedConfiguration || room.beds || `${room.numberOfBeds || 1} ${room.bedType || 'King'} bed`,
        bathrooms: room.numberOfBathrooms || room.bathrooms || 1,
        amenities: Array.isArray(room.amenities) ? room.amenities : (room.amenities ? room.amenities.split(',').map(a => a.trim()) : []),
        status: room.status || room.roomStatus || 'available'
      }));

      setRooms(transformedRooms);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoomAdded = (newRoom) => {
    setRooms(prev => [...prev, newRoom]);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      maxOccupancy: '1',
      area: '',
      bedType: 'Single',
      numberOfBeds: '1',
      bathrooms: '1',
      amenities: '',
      status: 'available',
      image: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (room) => {
    setCurrentRoom(room);
    // Extract bed type and number from beds string
    const bedParts = room.beds.split(' ');
    const numberOfBeds = bedParts[0];
    const bedType = bedParts[1];
    
    setFormData({
      name: room.name,
      price: room.price.toString(),
      maxOccupancy: room.maxOccupancy.toString(),
      area: room.area.toString(),
      bedType: bedType,
      numberOfBeds: numberOfBeds,
      bathrooms: room.bathrooms.toString(),
      amenities: room.amenities.join(', '),
      status: room.status,
      image: room.image
    });
    setImagePreview(room.image);
    setImageFile(null);
    setEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    const bedDescription = `${formData.numberOfBeds} ${formData.bedType} bed${formData.numberOfBeds > 1 ? 's' : ''}`;
    const amenitiesArray = formData.amenities.split(',').map(amenity => amenity.trim()).filter(amenity => amenity);
    
    const updatedRoom = {
      ...currentRoom,
      name: formData.name,
      price: parseInt(formData.price),
      maxOccupancy: parseInt(formData.maxOccupancy),
      area: parseInt(formData.area),
      beds: bedDescription,
      bathrooms: parseInt(formData.bathrooms),
      amenities: amenitiesArray,
      status: formData.status,
      image: imagePreview || currentRoom.image
    };

    setRooms(prev => prev.map(room => room.id === currentRoom.id ? updatedRoom : room));
    setEditModal(false);
    setCurrentRoom(null);
    resetForm();
  };

  const handleDeleteClick = (room) => {
    setCurrentRoom(room);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    setRooms(prev => prev.filter(room => room.id !== currentRoom.id));
    setDeleteModal(false);
    setCurrentRoom(null);
  };

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B9ED9]"></div>
            <p className="mt-4 text-gray-600">Loading rooms...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Rooms</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={fetchRooms}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        {/* Add New Room Button */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#0B9ED9] hover:bg-[#0891C7] text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center gap-2 hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Room
          </button>
        </div>

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new room.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-xl overflow-hidden border border-gray-300 shadow-lg hover:shadow-xl transition-shadow">
                {/* Room Image */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";
                    }}
                  />
                </div>
                
                {/* Room Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[room.status]}`}>
                      {statusLabels[room.status]}
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center text-gray-600 mb-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 text-lg">{formatPrice(room.price)}/night</span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Max {room.maxOccupancy} person{room.maxOccupancy > 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      {room.area} sqm
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                      </svg>
                      {room.beds}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                      </svg>
                      {room.bathrooms} Bathroom{room.bathrooms > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.length > 0 ? (
                        room.amenities.map((amenity, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">No amenities listed</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <button 
                      onClick={() => handleEdit(room)}
                      className="text-[#2953A6] hover:text-[#1F74BF] font-medium text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(room)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Insert Room Modal Component */}
        <InsertRoom 
          showModal={showModal}
          setShowModal={setShowModal}
          onRoomAdded={handleRoomAdded}
        />

        {/* Edit Room Modal */}
        {editModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Room</h2>
                  <button 
                    onClick={() => setEditModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  {/* Room Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      placeholder="Enter room name"
                    />
                  </div>

                  {/* Pricing Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Details</h3>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night (LKR)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                        placeholder="Enter price in LKR"
                      />
                    </div>

                    {/* Maximum Occupancy */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Occupancy</label>
                      <select
                        name="maxOccupancy"
                        value={formData.maxOccupancy}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      >
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="3">3 people</option>
                        <option value="4">4 people</option>
                        <option value="5">5 people</option>
                      </select>
                    </div>

                    {/* Room Area */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Room Area (sqm)</label>
                      <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                        placeholder="Enter room area in square meters"
                      />
                    </div>
                  </div>

                  {/* Bed Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bed Type</label>
                      <select
                        name="bedType"
                        value={formData.bedType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Queen">Queen</option>
                        <option value="King">King</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Beds</label>
                      <select
                        name="numberOfBeds"
                        value={formData.numberOfBeds}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Bathrooms</label>
                    <select
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                    <textarea
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      placeholder="Enter amenities separated by commas (e.g., Air conditioning, Free WiFi, Minibar)"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Image</label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2953A6] focus:border-transparent"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#2953A6] hover:bg-[#1F74BF] text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Update Room
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete Room</h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete "<span className="font-semibold">{currentRoom?.name}</span>"? This action cannot be undone.
                </p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoomServicePage;