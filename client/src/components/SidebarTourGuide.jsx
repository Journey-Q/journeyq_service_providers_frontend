import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiDollarSign,
  FiMap,
  FiPackage,
  FiTag,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiUser
} from 'react-icons/fi';

const SidebarTourGuide = () => {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen pt-4 pb-4 pl-4 border-r border-[#0B9ED9]/30 bg-[#2953A6]">
      {/* Branding Header */}
      <div className="p-4 border-b border-[#1F74BF] bg-[#2953A6]">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="w-12 h-12 rounded-full bg-[#F2F2F2] flex items-center justify-center shadow-md">
            <FiUser className="text-[#2953A6] text-xl" />
          </div>
          
          {/* Company Name & Username */}
          <div className="flex flex-col justify-center h-12">
            <h1 className="text-lg font-bold text-[#F2F2F2] leading-tight">Wednesday Tours</h1>
            <p className="text-xs text-[#07C7F2] leading-tight">guide@wednesdaytours.com</p>
          </div>
        </div>
      </div>

      <ul className="space-y-2 w-full text-left mt-4">
        <li className={`hover:bg-[#1F74BF]/30 p-2 rounded transition-colors ${location.pathname === '/tour-guide/dashboard' ? 'bg-[#1F74BF]/30 text-[#F2F2F2]' : 'text-[#F2F2F2]/90'}`}>
          <span className="flex items-center">
            <FiHome className="h-5 w-5 text-[#07C7F2] mr-2" />
            <Link to="/tour-guide/dashboard" className="block w-full">
              Dashboard
            </Link>
          </span>
        </li>

        <li className={`hover:bg-[#1F74BF]/30 p-2 rounded transition-colors ${location.pathname === '/tour-guide/booking-history' ? 'bg-[#1F74BF]/30 text-[#F2F2F2]' : 'text-[#F2F2F2]/90'}`}>
          <span className="flex items-center">
            <FiCalendar className="h-5 w-5 text-[#07C7F2] mr-2" />
            <Link to="/tour-guide/booking-history" className="block w-full">
              Booking History
            </Link>
          </span>
        </li>

        <li className={`hover:bg-[#1F74BF]/30 p-2 rounded transition-colors ${location.pathname === '/tour-guide/payment-history' ? 'bg-[#1F74BF]/30 text-[#F2F2F2]' : 'text-[#F2F2F2]/90'}`}>
          <span className="flex items-center">
            <FiDollarSign className="h-5 w-5 text-[#07C7F2] mr-2" />
            <Link to="/tour-guide/payment-history" className="block w-full">
              Payment History
            </Link>
          </span>
        </li>

        <li className={`hover:bg-[#1F74BF]/30 p-2 rounded transition-colors ${location.pathname === '/tour-guide/tours' ? 'bg-[#1F74BF]/30 text-[#F2F2F2]' : 'text-[#F2F2F2]/90'}`}>
          <span className="flex items-center">
            <FiMap className="h-5 w-5 text-[#07C7F2] mr-2" />
            <Link to="/tour-guide/tours" className="block w-full">
              Tours
            </Link>
          </span>
        </li>

        <li className={`hover:bg-[#1F74BF]/30 p-2 rounded transition-colors ${location.pathname === '/tour-guide/promotions' ? 'bg-[#1F74BF]/30 text-[#F2F2F2]' : 'text-[#F2F2F2]/90'}`}>
          <span className="flex items-center">
            <FiTag className="h-5 w-5 text-[#07C7F2] mr-2" />
            <Link to="/tour-guide/promotions" className="block w-full">
              Promotions
            </Link>
          </span>
        </li>

        <li className={`hover:bg-[#1F74BF]/30 p-2 rounded transition-colors ${location.pathname === '/tour-guide/chat' ? 'bg-[#1F74BF]/30 text-[#F2F2F2]' : 'text-[#F2F2F2]/90'}`}>
          <span className="flex items-center justify-between">
            <span className="flex items-center">
              <FiMessageSquare className="h-5 w-5 text-[#07C7F2] mr-2" />
              <Link to="/tour-guide/chat" className="block w-full">
                Chat
              </Link>
            </span>
            <span className="bg-[#07C7F2] text-[#2953A6] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </span>
        </li>

        <li className={`hover:bg-[#1F74BF]/30 p-2 rounded transition-colors ${location.pathname === '/tour-guide/settings' ? 'bg-[#1F74BF]/30 text-[#F2F2F2]' : 'text-[#F2F2F2]/90'}`}>
          <span className="flex items-center">
            <FiSettings className="h-5 w-5 text-[#07C7F2] mr-2" />
            <Link to="/tour-guide/settings" className="block w-full">
              Settings
            </Link>
          </span>
        </li>

        {/* <li className={`hover:bg-[#1F74BF]/30 p-2 rounded transition-colors ${location.pathname === '/tour-guide/create-profile' ? 'bg-[#1F74BF]/30 text-[#F2F2F2]' : 'text-[#F2F2F2]/90'}`}>
          <span className="flex items-center">
            <FiUser className="h-5 w-5 text-[#07C7F2] mr-2" />
            <Link to="/tour-guide/create-profile" className="block w-full">
              Create Profile
            </Link>
          </span>
        </li> */}

        <li className="hover:bg-[#1F74BF]/30 p-2 rounded transition-colors mt-8 text-[#F2F2F2]/90">
          <span className="flex items-center">
            <FiLogOut className="h-5 w-5 text-[#07C7F2] mr-2" />
            <Link to="/logout" className="block w-full">
              Logout
            </Link>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default SidebarTourGuide;