import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const location = useLocation();
  
  // List of paths where Navbar should be hidden
  const noNavbarPaths = [
    '/login',
    '/register',
    '/register/hotel',
    '/register/tour-guide',
    '/register/travel-agency',
    '/hotel/create-profile',
    '/tour-guide/create-profile',
    '/travel-agency/create-profile'
    // Add more paths here as needed
  ];
  
  // Check if current path is in noNavbarPaths
  const shouldShowNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </div>
  );
}

export default App;