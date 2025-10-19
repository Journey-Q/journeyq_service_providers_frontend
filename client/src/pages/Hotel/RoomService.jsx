import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SidebarHotel';
import RoomService from '../../api_service/RoomService';
import InsertRoom from './InsertRoom';
import EditRoom from './EditRoom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RoomServicePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Track current image index for each room
  const [roomImageIndices, setRoomImageIndices] = useState({});
  
  // Get service provider ID from localStorage or context
  const serviceProvider = localStorage.getItem('serviceProvider');
  const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;

  const statusColors = {
    AVAILABLE: "bg-green-100 text-green-800",
    OCCUPIED: "bg-red-100 text-red-800",
    MAINTENANCE: "bg-yellow-100 text-yellow-800"
  };

  const statusLabels = {
    AVAILABLE: "Available",
    OCCUPIED: "Occupied",
    MAINTENANCE: "Maintenance"
  };

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (deleteSuccess) {
      const timer = setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!serviceProviderId) {
        throw new Error('Service Provider ID not found. Please login again.');
      }

      const data = await RoomService.getRoomsByServiceProviderId(serviceProviderId);
      
      console.log('Raw API response:', data);
      
      // Transform API data to match UI format
      const transformedRooms = data.map(room => {
        // Parse bed configuration from "1 Queen bed" format
        const bedParts = room.beds ? room.beds.split(' ') : ['1', 'Single', 'bed'];
        const numberOfBeds = bedParts[0];
        const bedType = bedParts[1];
        
        return {
          id: room.id,
          name: room.name,
          image: room.images && room.images.length > 0 ? room.images[0] : "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
          price: room.price,
          maxOccupancy: room.maxOccupancy,
          area: room.area,
          beds: room.beds,
          numberOfBeds: numberOfBeds,
          bedType: bedType,
          bathrooms: room.bathrooms,
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
          status: room.status,
          images: room.images || [],
          createdAt: room.createdAt,
          updatedAt: room.updatedAt
        };
      });

      console.log('Transformed rooms:', transformedRooms);
      setRooms(transformedRooms);
      
      // Initialize image indices for all rooms
      const indices = {};
      transformedRooms.forEach(room => {
        indices[room.id] = 0;
      });
      setRoomImageIndices(indices);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomAdded = (newRoom) => {
    // Transform the new room to match our format
    const transformedRoom = {
      id: newRoom.id,
      name: newRoom.name,
      image: newRoom.images && newRoom.images.length > 0 ? newRoom.images[0] : "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      price: newRoom.price,
      maxOccupancy: newRoom.maxOccupancy,
      area: newRoom.area,
      beds: newRoom.beds,
      bathrooms: newRoom.bathrooms,
      amenities: Array.isArray(newRoom.amenities) ? newRoom.amenities : [],
      status: newRoom.status,
      images: newRoom.images || []
    };
    
    setRooms(prev => [...prev, transformedRoom]);
    setRoomImageIndices(prev => ({ ...prev, [transformedRoom.id]: 0 }));
  };

  const handleEdit = (room) => {
    setCurrentRoom(room);
    setEditModal(true);
  };

  const handleRoomUpdated = (updatedRoom) => {
    setRooms(prev => prev.map(room => room.id === updatedRoom.id ? updatedRoom : room));
  };

  const handleDeleteClick = (room) => {
    setCurrentRoom(room);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Call API to delete room
      await RoomService.deleteRoom(currentRoom.id);
      
      // Update local state
      setRooms(prev => prev.filter(room => room.id !== currentRoom.id));
      setDeleteModal(false);
      setCurrentRoom(null);
      setDeleteSuccess(true); // Show success message
      
    } catch (err) {
      console.error('Error deleting room:', err);
      // You could also show an error message in the UI instead of alert
      setError('Failed to delete room: ' + err.message);
    }
  };

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  // Image carousel handlers
  const handlePrevImage = (roomId, totalImages, e) => {
    e.stopPropagation();
    setRoomImageIndices(prev => ({
      ...prev,
      [roomId]: prev[roomId] === 0 ? totalImages - 1 : prev[roomId] - 1
    }));
  };

  const handleNextImage = (roomId, totalImages, e) => {
    e.stopPropagation();
    setRoomImageIndices(prev => ({
      ...prev,
      [roomId]: prev[roomId] === totalImages - 1 ? 0 : prev[roomId] + 1
    }));
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
        {/* Success Message */}
        {deleteSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-medium">Room deleted successfully!</span>
            </div>
            <button 
              onClick={() => setDeleteSuccess(false)}
              className="text-green-600 hover:text-green-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

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
            {rooms.map((room) => {
              const currentImageIndex = roomImageIndices[room.id] || 0;
              const currentImage = room.images.length > 0 ? room.images[currentImageIndex] : room.image;
              const hasMultipleImages = room.images.length > 1;

              return (
                <div key={room.id} className="bg-white rounded-xl overflow-hidden border border-gray-300 shadow-lg hover:shadow-xl transition-shadow">
                  {/* Room Image with Carousel */}
                  <div className="h-48 overflow-hidden relative group">
                    <img 
                      src={currentImage} 
                      alt={`${room.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";
                      }}
                    />
                    
                    {/* Image Navigation Controls */}
                    {hasMultipleImages && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={(e) => handlePrevImage(room.id, room.images.length, e)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={(e) => handleNextImage(room.id, room.images.length, e)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          {currentImageIndex + 1} / {room.images.length}
                        </div>
                      </>
                    )}
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
              );
            })}
          </div>
        )}

        {/* Insert Room Modal Component */}
        <InsertRoom 
          showModal={showModal}
          setShowModal={setShowModal}
          onRoomAdded={handleRoomAdded}
        />

        {/* Edit Room Modal Component */}
        <EditRoom
          editModal={editModal}
          setEditModal={setEditModal}
          currentRoom={currentRoom}
          setCurrentRoom={setCurrentRoom}
          onRoomUpdated={handleRoomUpdated}
        />

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