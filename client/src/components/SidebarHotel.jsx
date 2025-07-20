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
  FiUser,
  FiStar,
} from 'react-icons/fi';
import { AiOutlineBank } from 'react-icons/ai';

const SidebarHotel = () => {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      {/* Hotel Branding Header */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
            <FiUser className="text-[#2953A6] text-xl" />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-semibold text-black leading-tight font-poppins">
              Hotel Quasar
            </h1>
            <p className="text-xs text-black/80 leading-tight font-poppins">
              admin@hotelquasar.com
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-1">
          {[
            { path: '/hotel/dashboard', icon: FiHome, label: 'Dashboard' },
            { path: '/hotel/booking-history', icon: FiCalendar, label: 'Booking History' },
            { path: '/hotel/room-service', icon: FiCoffee, label: 'Room Service' },
            { path: '/hotel/promotions', icon: FiTag, label: 'Promotions' },
            { path: '/hotel/payment-history', icon: FiDollarSign, label: 'Payment History' },
            { path: '/hotel/bankdetails', icon: AiOutlineBank, label: 'Bank Details' },
            {
              path: '/hotel/chat',
              icon: FiMessageSquare,
              label: 'Messages',
              badge: 3
            },
            { path: '/hotel/reviews', icon: FiStar, label: 'Reviews & Ratings' }, // NEW ITEM
            { path: '/hotel/settings', icon: FiSettings, label: 'Settings' },
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
                    ? 'bg-blue-50 text-[#2953A6] font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#2953A6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`h-5 w-5 ${
                      location.pathname === item.path ? 'text-[#2953A6]' : 'text-gray-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#07C7F2] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#2953A6] transition-all"
        >
          <FiLogOut className="h-5 w-5 text-gray-500" />
          <span>Logout</span>
        </Link>
      </nav>
    </div>
  );
};

export default SidebarHotel;
