import React from 'react';
import Sidebar from '../../components/SidebarHotel';
import {Link} from 'react-router-dom'

const RoomService = () => {
  // Sample room data
  const rooms = [
    {
      id: 1,
      name: "Deluxe Ocean View",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      price: 250,
      area: "45 sqm",
      amenities: ["King bed", "Ocean view", "Minibar", "Air conditioning", "Free WiFi"],
      status: "available"
    },
    {
      id: 2,
      name: "Executive Suite",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      price: 350,
      area: "60 sqm",
      amenities: ["King bed", "Separate living area", "Jacuzzi", "Air conditioning", "Free WiFi"],
      status: "occupied"
    },
    {
      id: 3,
      name: "Standard Room",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      price: 150,
      area: "30 sqm",
      amenities: ["Queen bed", "Air conditioning", "Free WiFi"],
      status: "maintenance"
    }
  ];

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Room Service Management</h1>
          <p className="text-gray-600 mt-2">
            View and manage all hotel rooms and their availability
          </p>
        </header>

        {/* Add New Room Button */}
        <div className="mb-6 flex justify-end">
          <button className="bg-[#2953A6] hover:bg-[#1F74BF] text-white px-4 py-2 rounded-lg  transition-colors">
            + Add New Room
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl overflow-hidden border border-gray-300">
              {/* Room Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Room Details */}
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[room.status]}`}>
                    {statusLabels[room.status]}
                  </span>
                </div>
                
                <div className="mt-3 flex items-center text-gray-600">
                  <span className="font-medium text-gray-800">${room.price}</span>
                  <span className="mx-2">•</span>
                  <span>{room.area}</span>
                </div>
                
                {/* Amenities */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex justify-between">
                  <button className="text-[#2953A6] hover:text-[#1F74BF] font-medium text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>

                    <Link to="/hotel/edit-room-service">
                    Edit
                    </Link>
                    
                  </button>
                  <button className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center">
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
      </main>
    </div>
  );
};

export default RoomService;