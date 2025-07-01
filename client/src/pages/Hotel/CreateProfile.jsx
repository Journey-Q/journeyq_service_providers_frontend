import React from 'react';
import Sidebar from '../../components/SidebarHotel';

const CreateProfile = () => {
  return (
    <div className="flex h-screen">
      <Sidebar/>
      
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-4">Create Profile - Hotel</h1>
        {/* Add your dashboard widgets/stats here */}
      </div>
    </div>
  );
};

export default CreateProfile;