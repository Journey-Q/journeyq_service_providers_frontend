import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import RoomService from '../../api_service/RoomService'; // Adjust import path as needed

const RoomsOverview = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0
  });

  // Get service provider ID from localStorage
  const serviceProvider = localStorage.getItem('serviceProvider');
  const serviceProviderId = serviceProvider ? JSON.parse(serviceProvider).id : null;

  // Helper function to safely get the first image
  const getFirstImage = (room) => {
    // Check if images array exists and has items
    if (room.images && Array.isArray(room.images) && room.images.length > 0) {
      return room.images[0];
    }
    // Fallback to single image field if it exists
    if (room.image && typeof room.image === 'string') {
      return room.image;
    }
    // Default fallback image
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";
  };

  // Fetch rooms data from backend
  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!serviceProviderId) {
          throw new Error('Service Provider ID not found. Please login again.');
        }

        // Fetch rooms from backend
        const data = await RoomService.getRoomsByServiceProviderId(serviceProviderId);
        
        console.log('Fetched rooms for overview:', data);

        // Transform API data to match component format
        const transformedRooms = data.map(room => ({
          id: room.id,
          name: room.name,
          image: getFirstImage(room), // Use helper function
          images: room.images || [], // Keep full images array for reference
          price: room.price,
          area: `${room.area} sqm`,
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
          status: room.status,
          beds: room.beds,
          bathrooms: room.bathrooms,
          maxOccupancy: room.maxOccupancy
        }));

        // Calculate statistics
        const total = transformedRooms.length;
        const available = transformedRooms.filter(room => room.status === 'AVAILABLE').length;
        const occupied = transformedRooms.filter(room => room.status === 'OCCUPIED').length;
        const maintenance = transformedRooms.filter(room => room.status === 'MAINTENANCE').length;

        setStats({ total, available, occupied, maintenance });
        setRooms(transformedRooms);

      } catch (err) {
        console.error('Error fetching rooms for overview:', err);
        setError(err.message || 'Failed to fetch rooms data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomsData();
  }, [serviceProviderId]);

  // Get available rooms for display (limit to 3)
  const availableRooms = rooms
    .filter(room => room.status === 'AVAILABLE')
    .slice(0, 3);

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'OCCUPIED':
        return 'bg-red-100 text-red-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Available';
      case 'OCCUPIED':
        return 'Occupied';
      case 'MAINTENANCE':
        return 'Maintenance';
      default:
        return status;
    }
  };

  const formatPrice = (price) => {
    return `Rs.${price?.toLocaleString('en-IN') || '0'}`;
  };

  // Loading state
  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
        <header className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Available Rooms</h2>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </header>
        <div className="flex-1 p-4 space-y-4">
          {/* Loading skeleton for stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-8 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-8 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          {/* Loading skeleton for rooms */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="flex space-x-1">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-10"></div>
                </div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
        <header className="p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Available Rooms</h2>
        </header>
        <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#1F74BF] text-white rounded-lg text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
      <header className="p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Available Rooms</h2>
          <Link 
            to="/hotel/room-service"
            className="flex items-center text-[#2953A6] hover:text-[#1F74BF] font-medium text-sm transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            View All
          </Link>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600">{stats.available}</div>
              <div className="text-xs text-green-700">Available</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="text-xl font-bold text-red-600">{stats.occupied}</div>
              <div className="text-xs text-red-700">Occupied</div>
            </div>
          </div>
        </div>

        {/* Available Rooms List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {availableRooms.length === 0 ? (
            <div className="text-center py-6">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500 text-sm">No available rooms at the moment</p>
            </div>
          ) : (
            availableRooms.map((room) => (
              <div key={room.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-800 text-sm truncate">{room.name}</h5>
                  <div className="flex items-center text-xs text-gray-600 mt-1">
                    <span className="font-medium text-[#2953A6]">{formatPrice(room.price)}</span>
                    <span className="mx-1">•</span>
                    <span>{room.area}</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    {room.amenities.slice(0, 2).map((amenity, index) => (
                      <span key={index} className="bg-white text-gray-600 text-xs px-1.5 py-0.5 rounded border">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 2 && (
                      <span className="text-gray-500 text-xs">
                        +{room.amenities.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getStatusBadgeClass(room.status)}`}>
                  {getStatusLabel(room.status)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Occupancy Rate:</span>
            <span className="font-medium text-gray-800">
              {stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Rooms:</span>
            <span className="font-medium text-gray-800">{stats.total}</span>
          </div>
          <Link 
            to="/hotel/room-service"
            className="block w-full px-4 py-2 bg-[#1F74BF] text-white text-center rounded-lg transition-colors font-medium text-sm"
          >
            Manage All Rooms
          </Link>
        </div>
      </div>
    </section>
  );
};

export { RoomsOverview };