import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterAsTravelAgency = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Travel Agency Information
    agencyName: '',
    address: '',
    contactNumber: '',
    businessRegNumber: '',
    profilePicture: null,
    
    // Account Information
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/tour-guide/create-profile');
  };

  return (
    <div className="min-h-screen bg-[#d1e8ed] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* First White Block - Travel Agency Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Travel Agency Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700">
                Agency Name*
              </label>
              <input
                type="text"
                id="agencyName"
                name="agencyName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2953A6] focus:ring-[#2953A6] p-2"
                value={formData.agencyName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address*
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2953A6] focus:ring-[#2953A6] p-2"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number*
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2953A6] focus:ring-[#2953A6] p-2"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="businessRegNumber" className="block text-sm font-medium text-gray-700">
                Business Registration Number*
              </label>
              <input
                type="text"
                id="businessRegNumber"
                name="businessRegNumber"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2953A6] focus:ring-[#2953A6] p-2"
                value={formData.businessRegNumber}
                onChange={handleChange}
              />
            </div>

            
          </div>
        </div>

        {/* Second White Block - Account Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Account Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2953A6] focus:ring-[#2953A6] p-2"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password*
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2953A6] focus:ring-[#2953A6] p-2"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password*
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2953A6] focus:ring-[#2953A6] p-2"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Already have an account section */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#2953A6] hover:text-[#1F74BF]">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2953A6] hover:bg-[#1F74BF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2953A6]"
        >
          Register Agency
        </button>
      </div>
    </div>
  );
};

export default RegisterAsTravelAgency;