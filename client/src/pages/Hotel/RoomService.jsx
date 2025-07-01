import React from 'react'
import SidebarHotel from '../../components/SidebarHotel';

const RoomService = () => {
  return (
    <div className="flex h-screen">
      <SidebarHotel />
      
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-4">Room Service - Hotel</h1>
        {/* Add your dashboard widgets/stats here */}
      </div>
    </div>
  );
}

export default RoomService
