import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  FiUser,
  FiStar
} from 'react-icons/fi';
import { Building2 as AiOutlineBank } from 'lucide-react';

const SidebarTourGuide = () => {
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
      // Fetch tour guide profile data  
      const tourGuideProfileData = localStorage.getItem('tour_guide_profile');
      
      let userData = null;
      let guideData = null;
      
      if (serviceProviderData) {
        userData = JSON.parse(serviceProviderData);
      }
      
      if (tourGuideProfileData) {
        guideData = JSON.parse(tourGuideProfileData);
      }
      
      // Only proceed if we have actual data
      if (userData || guideData) {
        // Combine both datasets
        const combinedData = {
          ...userData,
          ...guideData,
          // Use tour guide contact info if available, otherwise fall back to service provider data
          displayEmail: guideData?.contactInfo?.email || userData?.email,
          displayPhone: guideData?.contactInfo?.phone || userData?.contactNo,
          displayName: guideData?.guideName || guideData?.companyName || userData?.username
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
      localStorage.removeItem('tour_guide_profile');
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

  // Default values using combined tour guide profile and service provider data
  const displayName = userDetails?.displayName || userDetails?.guideName || userDetails?.companyName || userDetails?.username || 'Wednesday Tours';
  const displayEmail = userDetails?.displayEmail || userDetails?.email || 'guide@wednesdaytours.com';

  const navigationItems = [
    { path: '/tour-guide/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/tour-guide/booking-history', icon: FiCalendar, label: 'Booking History' },
    { path: '/tour-guide/payment-history', icon: FiDollarSign, label: 'Payment History' },
    { path: '/tour-guide/bankdetails', icon: AiOutlineBank, label: 'Bank Details' },
    { path: '/tour-guide/tours', icon: FiMap, label: 'Tour Packages' },
    { path: '/tour-guide/promotions', icon: FiTag, label: 'Promotions' },
    {
      path: '/tour-guide/chat',
      icon: FiMessageSquare,
      label: 'Messages',
      badge: 3
    },
    { path: '/tour-guide/reviews', icon: FiStar, label: 'Reviews & Ratings' },
    { path: '/tour-guide/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      {/* Tour Guide Branding Header */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          {/* Guide Photo or Default Avatar */}
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200 overflow-hidden flex-shrink-0">
            {userDetails?.guidePhoto && !imageError ? (
              <img 
                src={userDetails.guidePhoto} 
                alt="Guide Profile"
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
            <p className="text-xs text-black/80 leading-tight font-poppins truncate">
              {displayEmail}
            </p>
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

export default SidebarTourGuide;