import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const RoomsOverview = () => {
  // Sample available rooms data (filtered for available rooms only)
  const availableRooms = [
    {
      id: 1,
      name: "Deluxe Ocean View",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      price: 250,
      area: "45 sqm",
      amenities: ["King bed", "Ocean view", "Minibar"],
      status: "available"
    },
    {
      id: 2,
      name: "Garden Suite",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      price: 200,
      area: "38 sqm",
      amenities: ["Queen bed", "Garden view", "Balcony"],
      status: "available"
    },
    {
      id: 3,
      name: "Executive Suite",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      price: 350,
      area: "60 sqm",
      amenities: ["King bed", "Living area", "Jacuzzi"],
      status: "available"
    }
  ];

  const totalRooms = 25; // Total rooms in hotel
  const availableCount = 8; // Available rooms count
  const occupiedCount = 15; // Occupied rooms count
  const maintenanceCount = 2; // Under maintenance count

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
              <div className="text-xl font-bold text-green-600">{availableCount}</div>
              <div className="text-xs text-green-700">Available</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="text-xl font-bold text-red-600">{occupiedCount}</div>
              <div className="text-xs text-red-700">Occupied</div>
            </div>
          </div>
        </div>

        {/* Available Rooms List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {availableRooms.map((room) => (
            <div key={room.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <img 
                src={room.image} 
                alt={room.name}
                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-800 text-sm truncate">{room.name}</h5>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <span className="font-medium text-[#2953A6]">${room.price}</span>
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
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                Available
              </span>
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Occupancy Rate:</span>
            <span className="font-medium text-gray-800">
              {Math.round((occupiedCount / totalRooms) * 100)}%
            </span>
          </div>
          <Link 
            to="/hotel/room-service"
            className="block w-full px-4 py-2 bg-[#1F74BF]  text-white text-center rounded-lg transition-colors font-medium text-sm"
          >
            Manage All Rooms
          </Link>
        </div>
      </div>
    </section>
  );
};

export { RoomsOverview };