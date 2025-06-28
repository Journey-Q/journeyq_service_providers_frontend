import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiDollarSign, 
  FiCoffee,
  FiTag,
  FiMessageSquare,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';

const SidebarHotel = () => {
  return (
    <div className="w-64 h-screen bg-[#2953A6] text-white p-4 flex flex-col">

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        <Link 
          to="/hotel/dashboard" 
          className="flex items-center p-3 rounded-lg hover:bg-[#1F74BF] transition-colors"
        >
          <FiHome className="mr-3" />
          Dashboard
        </Link>

        <Link 
          to="/hotel/booking-history" 
          className="flex items-center p-3 rounded-lg hover:bg-[#1F74BF] transition-colors"
        >
          <FiCalendar className="mr-3" />
          Booking History
        </Link>

        <Link 
          to="/hotel/payment-history" 
          className="flex items-center p-3 rounded-lg hover:bg-[#1F74BF] transition-colors"
        >
          <FiDollarSign className="mr-3" />
          Payment History
        </Link>

        <Link 
          to="/hotel/room-service" 
          className="flex items-center p-3 rounded-lg hover:bg-[#1F74BF] transition-colors"
        >
          <FiCoffee className="mr-3" />
          Room Service
        </Link>

        <Link 
          to="/hotel/promotions" 
          className="flex items-center p-3 rounded-lg hover:bg-[#1F74BF] transition-colors"
        >
          <FiTag className="mr-3" />
          Promotions
        </Link>

        <Link 
          to="/hotel/chat" 
          className="flex items-center p-3 rounded-lg hover:bg-[#1F74BF] transition-colors"
        >
          <FiMessageSquare className="mr-3" />
          Chat
        </Link>

        <Link 
          to="/hotel/settings" 
          className="flex items-center p-3 rounded-lg hover:bg-[#1F74BF] transition-colors"
        >
          <FiSettings className="mr-3" />
          Settings
        </Link>
      </nav>

      {/* Logout Button */}
      <button className="flex items-center p-3 rounded-lg hover:bg-[#1F74BF] transition-colors mt-auto">
        <FiLogOut className="mr-3" />
        Logout
      </button>
    </div>
  );
};

export default SidebarHotel;