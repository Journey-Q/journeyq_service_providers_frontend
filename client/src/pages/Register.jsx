import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import logo from "../assets/images/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNestedRoute = location.pathname !== '/register';

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='bg-[#d1e8ed] min-h-screen w-full flex flex-col items-center pt-12 px-4'>
      {/* Logo - disappears in nested route */}
      {!isNestedRoute && (
        <img src={logo} alt="JourneyQ Logo" className="h-16 mb-8" />
      )}
      
      {/* Heading - disappears in nested route */}
      {!isNestedRoute && (
        <h1 className='text-[#2953A6] text-2xl font-bold mb-12'>Register As</h1>
      )}
      
      {/* Three Option Buttons - disappear completely in nested route */}
      {!isNestedRoute && (
        <div className="flex justify-between w-full max-w-4xl transition-all duration-500 mb-12 gap-4">
          <Link 
            to="hotel"
            className="flex-1 min-w-0 bg-white text-[#2953A6] font-bold text-2xl py-8 px-4 rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center h-32"
          >
            <span className="text-center">Hotel</span>
          </Link>
          
          <Link 
            to="tour-guide" 
            className="flex-1 min-w-0 bg-white text-[#2953A6] font-bold text-2xl py-8 px-4 rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center h-32"
          >
            <span className="text-center">Tour Guide</span>
          </Link>
          
          <Link 
            to="travel-agency" 
            className="flex-1 min-w-0 bg-white text-[#2953A6] font-bold text-2xl py-8 px-4 rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center h-32"
          >
            <span className="text-center">Travel Agency</span>
          </Link>
        </div>
      )}
      
      {/* Nested Route Content */}
      <div className="w-full max-w-4xl">
        <Outlet />
      </div>

      {/* Back button */}
      <button
        onClick={handleGoBack}
        className="fixed bottom-4 left-4 flex items-center text-black hover:text-[#365961] transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>
    </div>
  );
};

export default Register;