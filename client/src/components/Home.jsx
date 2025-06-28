import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/images/heroImage.jpg';

const Home = () => {
  useEffect(() => {
    const textElement = document.querySelector('.float-text');
    
    // Initial state (hidden below)
    textElement.style.transform = 'translateY(20px)';
    textElement.style.opacity = '0';
    
    // Animate in
    setTimeout(() => {
      textElement.style.transition = 'transform 2s ease, opacity 2s ease';
      textElement.style.transform = 'translateY(0)';
      textElement.style.opacity = '1';
    }, 100);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div 
        className="h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="text-center px-4 overflow-hidden">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 float-text">
            Welcome to JourneyQ
          </h1>
          <p className='text-white pb-10'>
            "JourneyQ is your all-in-one travel companion — plan trips, book services, and share your journey across Sri Lanka."
          </p>
          
          <Link 
            to="/register" 
            className="inline-block bg-[#0B9ED9] hover:bg-[#07C7F2] text-white font-medium py-3 px-8 rounded-full text-lg transition transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </div>
      
      {/* Rest of your page content */}
      <div className="container mx-auto py-12">
        Hellooo
      </div>
    </div>
  );
};

export default Home;