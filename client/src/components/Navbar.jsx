import React from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiArrowRight } from 'react-icons/fi';
import logo from '../assets/images/logo.png'

const Navbar = () => {
  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-sm z-20">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Branding - with subtle hover effect */}
          <Link 
            to="/" 
            className="flex items-center group"
            aria-label="JourneyQ Home"
          >
            <img 
              src={logo} 
              className="w-8 h-8 transition-transform group-hover:rotate-6"
              alt=""
            />
            <span className="ml-2 text-lg font-semibold text-gray-900 font-display">
              JourneyQ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-7 md:flex">
            <Link
              to="/about"
              className="text-sm font-medium text-gray-600 hover:[#0B9ED9] transition-colors duration-200"
            >
              About
            </Link>
            
            <div className="relative group">
              <button className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-full bg-blue-50 hover:bg-blue-100 transition-all duration-200">
                <span className="mr-1.5">Get the app</span>
                <FiDownload className="w-3.5 h-3.5" />
              </button>
              <div className="absolute hidden px-2 pt-1 group-hover:block">
                <div className="w-2 h-2 rotate-45 bg-white border-l border-t border-gray-200 ml-5"></div>
                <div className="px-3 py-2 text-xs bg-white border border-gray-200 rounded shadow-sm">
                  Coming soon to app stores
                </div>
              </div>
            </div>
          </nav>

          {/* Auth Links - with subtle visual hierarchy */}
          <div className="items-center hidden space-x-4 md:flex">
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors duration-200"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="flex items-center px-3.5 py-1.5 text-sm font-medium text-white bg-[#0B9ED9] rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
              Get started <FiArrowRight className="ml-1 w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button would go here */}
          <button className="p-1 md:hidden" aria-label="Menu">
            <div className="w-5 space-y-1">
              <div className="h-0.5 bg-gray-600"></div>
              <div className="h-0.5 bg-gray-600"></div>
              <div className="h-0.5 bg-gray-600"></div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;