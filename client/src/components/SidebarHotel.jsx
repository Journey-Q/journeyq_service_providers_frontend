import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Building2 as AiOutlineBank } from 'lucide-react';

const SidebarHotel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState(location.pathname);
  const [userDetails, setUserDetails] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Update active route when location changes
  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);

  // Fetch data from localStorage
  useEffect(() => {
    try {
      // Fetch service provider basic data
      const serviceProviderData = localStorage.getItem('serviceProvider');
      // Fetch hotel profile data  
      const hotelProfileData = localStorage.getItem('hotel_profile');
      
      let userData = null;
      let hotelData = null;
      
      if (serviceProviderData) {
        userData = JSON.parse(serviceProviderData);
      }
      
      if (hotelProfileData) {
        hotelData = JSON.parse(hotelProfileData);
      }
      
      // Only proceed if we have actual data
      if (userData || hotelData) {
        // Combine both datasets
        const combinedData = {
          ...userData,
          ...hotelData,
          // Use hotel contact info if available, otherwise fall back to service provider data
          displayEmail: hotelData?.contactInfo?.email || userData?.email,
          displayPhone: hotelData?.contactInfo?.phone || userData?.contactNo,
          displayName: hotelData?.hotelName || userData?.username
        };
        
        setUserDetails(combinedData);
      }
    } catch (error) {
      console.error('Error fetching user details from localStorage:', error);
    }
  }, []);

  const handleLogout = () => {
    try {
      // Clear all authentication and user data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiresIn');
      localStorage.removeItem('serviceProvider');
      localStorage.removeItem('hotel_profile');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate to login even if there's an error clearing storage
      navigate('/login');
    }
  };

  const handleNavClick = (path) => {
    // Navigate to the selected path
    navigate(path);
    // Update active route state
    setActiveRoute(path);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Default values using combined hotel profile and service provider data
  const displayName = userDetails?.displayName || userDetails?.hotelName || userDetails?.username || 'Hotel Dashboard';
  const displayEmail = userDetails?.displayEmail || userDetails?.email || 'admin@hotel.com';

  const navigationItems = [
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
    { path: '/hotel/reviews', icon: FiStar, label: 'Reviews & Ratings' },
    { path: '/hotel/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      {/* Hotel Branding Header */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          {/* Hotel Photo or Default Avatar */}
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200 overflow-hidden flex-shrink-0">
            {userDetails?.hotelPhoto && !imageError ? (
              <img 
                src={userDetails.hotelPhoto} 
                alt="Hotel Profile"
                className="w-full h-full object-cover"
                onError={handleImageError}
                onLoad={() => setImageError(false)}
              />
            ) : (
              <FiUser className="text-[#2953A6] text-xl" />
            )}
          </div>
          
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-black leading-tight font-poppins truncate">
              {displayName}
            </h1>
            {/* <p className="text-xs text-black/80 leading-tight font-poppins truncate">
              {displayEmail}
            </p> */}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path} className="relative">
              {/* Active indicator line */}
              {activeRoute === item.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2953A6] to-[#07C7F2] rounded-r-full"></div>
              )}
              
              <button
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  activeRoute === item.path
                    ? 'bg-blue-50 text-[#2953A6] font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#2953A6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`h-5 w-5 ${
                      activeRoute === item.path ? 'text-[#2953A6]' : 'text-gray-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#07C7F2] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="my-4 border-t border-gray-100"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#2953A6] transition-all"
        >
          <FiLogOut className="h-5 w-5 text-gray-500" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default SidebarHotel;