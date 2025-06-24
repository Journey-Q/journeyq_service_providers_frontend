import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Home from './components/Home'
import Navbar from './components/Navbar';

import './App.css'


function App() {
  return (
    <div >
      <Navbar/>
      <Outlet/>

    </div>
  )
}

export default App