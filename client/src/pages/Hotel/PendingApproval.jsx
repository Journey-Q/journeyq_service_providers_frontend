import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const PendingApproval = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/hotel/create-profile');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <img
          src={logo}
          alt="tour-guide Logo"
          className="mx-auto mb-6 w-20 h-20 object-contain"
        />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Your registration is pending approval
        </h1>
        <p className="text-gray-600 text-sm">
          You’ll be redirected shortly to complete your profile...
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;