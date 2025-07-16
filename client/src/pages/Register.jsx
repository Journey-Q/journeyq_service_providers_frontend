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
    <div className='min-h-screen w-full bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col items-center pt-12 px-4'>
      {/* Header Section */}
      <header className="w-full max-w-4xl flex flex-col items-center mb-12">
        {!isNestedRoute && (
          <>
            <img src={logo} alt="JourneyQ Logo" className="h-16 mb-6" />
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Join Our Community</h1>
            <p className='text-gray-600 text-center max-w-md'>
              Select your account type to get started with JourneyQ
            </p>
          </>
        )}
      </header>
      
      {/* Main Content */}
      <main className="w-full max-w-4xl">
        {/* Registration Options - only shown on main register page */}
        {!isNestedRoute && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link 
              to="hotel"
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 flex flex-col items-center text-center hover:border-blue-200"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hotel</h3>
              <p className="text-gray-500 text-sm">For hotel owners and managers</p>
            </Link>
            
            <Link 
              to="tour-guide" 
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 flex flex-col items-center text-center hover:border-blue-200"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Tour Guide</h3>
              <p className="text-gray-500 text-sm">For professional tour guides</p>
            </Link>
            
            <Link 
              to="travel-agency" 
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 flex flex-col items-center text-center hover:border-blue-200"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Travel Agency</h3>
              <p className="text-gray-500 text-sm">For travel agencies and operators</p>
            </Link>
          </div>
        )}
        
        {/* Nested Route Content - now without white background */}
        <div className="rounded-xl">
          <Outlet />
        </div>
      </main>

      {/* Back button - only shown on nested routes */}
      {isNestedRoute && (
        <button
          onClick={handleGoBack}
          className="fixed bottom-8 left-8 bg-white rounded-full p-3 shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Register;