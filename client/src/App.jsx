import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Home from './Components/Home'
import Navbar from './Components/Navbar';

import './App.css'


function App() {
  return (
    <div >
      {/* <Navbar/> */}
      <Home/>

    </div>
  )
}

export default App