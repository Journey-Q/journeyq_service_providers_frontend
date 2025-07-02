import React from 'react';
import Sidebar from '../../components/SidebarHotel';

const EditRoomService = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6 bg-sky-100">
        <h1 className="text-2xl font-semibold mb-4">Edit room service - Hotel</h1>
        {/* Add your dashboard widgets/stats here */}
      </div>
    </div>
  );
};

export default EditRoomService;
