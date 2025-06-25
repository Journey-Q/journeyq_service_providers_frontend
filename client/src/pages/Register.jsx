import { Outlet, Link, useNavigate } from 'react-router-dom';


const Register = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };


  return (
    <div className='bg-[#2953A6] min-h-screen w-full'>
      <h1>Register</h1>
      {/* Navigation links to nested routes */}
      <nav>
        <Link to="hotel">Hotel</Link>
        <Link to="tour-guide">Tour Guide</Link>
        <Link to="travel-agency">Travel Agency</Link>
      </nav>
      
      {/* This will render the nested route components */}
      <Outlet />

      {/* Back button */}
      <button
        onClick={handleGoBack}
        className="absolute bottom-4 left-4 flex items-center text-white hover:text-[#07C7F2] transition-colors"
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