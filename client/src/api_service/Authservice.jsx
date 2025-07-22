// api/authService.js
import axios from 'axios';

// Base URL for your backend API
const API_BASE_URL = 'https://serviceprovidersservice-production.up.railway.app/service';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication service
export const authService = {
  // Login service provider
  login: async (loginData) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email: loginData.emailOrUsername, // Assuming emailOrUsername contains email
        password: loginData.password
      });

      const { accessToken, expiresIn, serviceProvider } = response.data;

      // Store token and user data in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('tokenExpiresIn', expiresIn.toString());
      localStorage.setItem('serviceProvider', JSON.stringify(serviceProvider));

      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
        errors: error.response?.data?.errors || null
      };
    }
  },

  // Register service provider
  signup: async (signupData) => {
    try {
      // Map frontend data to backend DTO format
      const requestData = {
        username: signupData.businessName, // Map businessName to username
        email: signupData.email,
        password: signupData.password,
        serviceType: signupData.serviceType, // Should be HOTEL, TOUR_GUIDE, or TRAVEL_AGENT
        businessRegistrationNumber: signupData.businessRegNumber,
        address: signupData.address,
        contactNo: signupData.phone
      };

      const response = await apiClient.post('/auth/signup', requestData);

      const { accessToken, expiresIn, serviceProvider } = response.data;

      // Store token and user data in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('tokenExpiresIn', expiresIn.toString());
      localStorage.setItem('serviceProvider', JSON.stringify(serviceProvider));

      return {
        success: true,
        data: response.data,
        message: 'Approval Request sent successfully'
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
        errors: error.response?.data?.errors || null
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpiresIn');
    localStorage.removeItem('serviceProvider');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const serviceProvider = localStorage.getItem('serviceProvider');
      return serviceProvider ? JSON.parse(serviceProvider) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    const expiresIn = localStorage.getItem('tokenExpiresIn');
    
    if (!token || !expiresIn) {
      return false;
    }

    // Check if token is expired (basic check)
    const now = Date.now();
    const tokenExpiry = parseInt(expiresIn);
    
    if (now > tokenExpiry) {
      authService.logout();
      return false;
    }

    return true;
  },

  // Get access token
  getToken: () => {
    return localStorage.getItem('accessToken');
  }
};

// Export default
export default authService;