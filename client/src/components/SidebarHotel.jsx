import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiDollarSign, 
  FiCoffee,
  FiTag,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiUser
} from 'react-icons/fi';

const SidebarHotel = () => {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen pt-4 pb-4 pl-4 border-r border-blue-100 bg-[#553F2D]/10">
      {/* Hotel Branding Header */}
<div className="p-4 border-b border-[#1F74BF] ">
  <div className="flex items-center gap-3">
    {/* Profile Picture */}
    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
      <FiUser className="text-[#2953A6] text-xl" />
    </div>
    
    {/* Hotel Name & Username - aligned with profile pic height */}
    <div className="flex flex-col justify-center h-12">
      <h1 className="text-lg font-bold leading-tight">Hotel Quasar</h1>
      <p className="text-xs text-[#07C7F2] leading-tight">admin@hotelquasar.com</p>
    </div>
  </div>
</div>

      <ul className="space-y-2 w-full text-left">
        <li className={`hover:bg-blue-50 p-2 rounded transition-colors ${location.pathname === '/hotel/dashboard' ? 'bg-blue-50' : ''}`}>
          <span className="flex items-center">
            <FiHome className="h-5 w-5 text-blue-600 mr-2" />
            <Link to="/hotel/dashboard" className="block w-full">
              Dashboard
            </Link>
          </span>
        </li>

        <li className={`hover:bg-blue-50 p-2 rounded transition-colors ${location.pathname === '/hotel/booking-history' ? 'bg-blue-50' : ''}`}>
          <span className="flex items-center">
            <FiCalendar className="h-5 w-5 text-blue-600 mr-2" />
            <Link to="/hotel/booking-history" className="block w-full">
              Booking History
            </Link>
          </span>
        </li>

        <li className={`hover:bg-blue-50 p-2 rounded transition-colors ${location.pathname === '/hotel/payment-history' ? 'bg-blue-50' : ''}`}>
          <span className="flex items-center">
            <FiDollarSign className="h-5 w-5 text-blue-600 mr-2" />
            <Link to="/hotel/payment-history" className="block w-full">
              Payment History
            </Link>
          </span>
        </li>

        <li className={`hover:bg-blue-50 p-2 rounded transition-colors ${location.pathname === '/hotel/room-service' ? 'bg-blue-50' : ''}`}>
          <span className="flex items-center">
            <FiCoffee className="h-5 w-5 text-blue-600 mr-2" />
            <Link to="/hotel/room-service" className="block w-full">
              Room Service
            </Link>
          </span>
        </li>

        <li className={`hover:bg-blue-50 p-2 rounded transition-colors ${location.pathname === '/hotel/promotions' ? 'bg-blue-50' : ''}`}>
          <span className="flex items-center">
            <FiTag className="h-5 w-5 text-blue-600 mr-2" />
            <Link to="/hotel/promotions" className="block w-full">
              Promotions
            </Link>
          </span>
        </li>

        <li className={`hover:bg-blue-50 p-2 rounded transition-colors ${location.pathname === '/hotel/chat' ? 'bg-blue-50' : ''}`}>
          <span className="flex items-center justify-between">
            <span className="flex items-center">
              <FiMessageSquare className="h-5 w-5 text-blue-600 mr-2" />
              <Link to="/hotel/chat" className="block w-full">
                Guest Messages
              </Link>
            </span>
            <span className="bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </span>
        </li>

        <li className={`hover:bg-blue-50 p-2 rounded transition-colors ${location.pathname === '/hotel/settings' ? 'bg-blue-50' : ''}`}>
          <span className="flex items-center">
            <FiSettings className="h-5 w-5 text-blue-600 mr-2" />
            <Link to="/hotel/settings" className="block w-full">
              Settings
            </Link>
          </span>
        </li>

        <li className="hover:bg-blue-50 p-2 rounded transition-colors mt-8">
          <span className="flex items-center">
            <FiLogOut className="h-5 w-5 text-blue-600 mr-2" />
            <Link to="/logout" className="block w-full">
              Logout
            </Link>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default SidebarHotel;