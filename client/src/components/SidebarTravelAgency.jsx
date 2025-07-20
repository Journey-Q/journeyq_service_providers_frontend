import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiDollarSign,
  FiTruck,
  FiTag,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiUser,
  FiStar,
  FiUsers
} from 'react-icons/fi';
import { AiOutlineBank } from 'react-icons/ai';

const SidebarTravelAgency = () => {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      {/* Branding Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <FiUser className="text-[#2953A6] text-xl" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-semibold text-black leading-tight">Travel Agency</h1>
            <p className="text-xs text-black/80 leading-tight">agency@example.com</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {[
            { path: '/travel-agency/dashboard', icon: FiHome, label: 'Dashboard' },
            { path: '/travel-agency/booking-history', icon: FiCalendar, label: 'Booking History' },
            { path: '/travel-agency/payment-history', icon: FiDollarSign, label: 'Payment History' },
            { path: '/travel-agency/bankdetails', icon: AiOutlineBank, label: 'Bank Details' },
            { path: '/travel-agency/vehicles', icon: FiTruck, label: 'Vehicles' },
            { path: '/travel-agency/drivers', icon: FiUsers, label: 'Drivers' },
            { path: '/travel-agency/promotions', icon: FiTag, label: 'Promotions' },
            { 
              path: '/travel-agency/chat', 
              icon: FiMessageSquare, 
              label: 'Chat',
              badge: 3 
            },
            { path: '/travel-agency/reviews', icon: FiStar, label: 'Reviews & Ratings' },
            { path: '/travel-agency/settings', icon: FiSettings, label: 'Settings' },
          ].map((item) => (
            <li key={item.path} className="relative">
              {/* Active indicator line */}
              {location.pathname === item.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2953A6] to-[#07C7F2] rounded-r-full"></div>
              )}
              
              <Link 
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? 'bg-white text-[#2953A6] font-medium'
                    : 'text-gray-600 hover:bg-white/50 hover:text-[#2953A6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${
                    location.pathname === item.path ? 'text-[#2953A6]' : 'text-gray-500'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#07C7F2] text-[#2953A6] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="my-4 border-t border-gray-100"></div>

        {/* Logout */}
        <Link 
          to="/logout"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-white/50 hover:text-[#2953A6] transition-all"
        >
          <FiLogOut className="h-5 w-5 text-gray-500" />
          <span>Logout</span>
        </Link>
      </nav>
    </div>
  );
};

export default SidebarTravelAgency;