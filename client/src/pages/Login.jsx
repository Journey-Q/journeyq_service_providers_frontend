import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginimage from '../assets/images/loginimage.jpg';
import logo from '../assets/images/logo.png';

const Login = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Elements to animate
    const elementsToAnimate = [
      { selector: '.animated-logo', delay: 100 },
      { selector: '.animated-title', delay: 150 },
      { selector: '.animated-form', delay: 200 },
      { selector: '.animated-options', delay: 250 },
      { selector: '.animated-image', delay: 100 }
    ];

    elementsToAnimate.forEach(({ selector, delay }) => {
      const element = document.querySelector(selector);
      if (element) {
        // Initial state
        element.style.transform = 'translateY(20px)';
        element.style.opacity = '0';
        element.style.transition = 'none';

        // Animate after delay
        setTimeout(() => {
          element.style.transition = 'transform 2s ease, opacity 2s ease';
          element.style.transform = 'translateY(0)';
          element.style.opacity = '1';
        }, delay);
      }
    });
  }, []);

  return (
    <div className="flex h-screen relative">
      {/* Left side - Login form (1/3) */}
      <div className="w-1/3 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={logo} 
              alt="JourneyQ Logo" 
              className="h-16 animated-logo" 
              style={{ transition: 'none' }}
            />
          </div>
          
          {/* Greeting */}
          <h1 
            className="text-2xl font-bold text-center mb-6 animated-title"
            style={{ transition: 'none' }}
          >
            Login to JourneyQ
          </h1>
          
          {/* Form */}
          <form 
            className="space-y-4 animated-form"
            style={{ transition: 'none' }}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0B9ED9] hover:bg-[#1F74BF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2953A6]"
              >
                Sign in
              </button>
            </div>
          </form>
          
          {/* Additional options */}
          <div 
            className="mt-4 text-center space-y-2 animated-options"
            style={{ transition: 'none' }}
          >
            <div>
              <a href="#" className="text-sm text-[#1F74BF] hover:text-[#07C7F2]">
                Forgot password?
              </a>
            </div>
            <div>
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <a href="#" className="text-sm text-[#1F74BF] hover:text-[#07C7F2]">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Image (2/3) */}
      <div className="w-2/3">
        <img 
          src={loginimage} 
          alt="Login Background" 
          className="w-full h-full object-cover animated-image" 
          style={{ transition: 'none' }}
        />
      </div>

      {/* Back button */}
      <button 
        onClick={handleGoBack}
        className="absolute bottom-4 left-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </button>
    </div>
  );
};

export default Login;