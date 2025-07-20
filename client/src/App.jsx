import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const location = useLocation();
  
  // List of paths where Navbar should be hidden
  const noNavbarPaths = [
    
    // Add more paths here as needed
  ];
  
  // Check if current path is in noNavbarPaths
  const shouldShowNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {shouldShowNavbar && !<Navbar />}
      <Outlet />
    </div>
  );
}

export default App;