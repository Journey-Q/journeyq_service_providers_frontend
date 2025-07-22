
const HotelProfileService = {
  // Base API URL
  BASE_URL: 'https://serviceprovidersservice-production.up.railway.app/service/hotel-profiles',

  // Helper method to get auth headers
  getAuthHeaders() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
  },

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  },

  // Create Hotel Profile
  async createHotelProfile(profileData) {
    try {
      const response = await fetch(`${this.BASE_URL}/create`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      const responseData = await this.handleResponse(response);
      
      // Save hotel profile to localStorage
      localStorage.setItem('hotel_profile', JSON.stringify(responseData));
      console.log('Hotel profile created successfully:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Error creating hotel profile:', error);
      throw error;
    }
  },

  // Get Hotel Profile by ID
  async getHotelProfileById(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const responseData = await this.handleResponse(response);
      console.log('Hotel profile retrieved:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Error fetching hotel profile:', error);
      throw error;
    }
  },

  // Get All Hotel Profiles
  async getAllHotelProfiles() {
    try {
      const response = await fetch(`${this.BASE_URL}/all`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const responseData = await this.handleResponse(response);
      console.log('All hotel profiles retrieved:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Error fetching all hotel profiles:', error);
      throw error;
    }
  },

  // Update Hotel Profile
  async updateHotelProfile(id, profileData) {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      const responseData = await this.handleResponse(response);
      
      // Update localStorage if this is the current user's profile
      const currentProfile = localStorage.getItem('hotel_profile');
      if (currentProfile) {
        const parsed = JSON.parse(currentProfile);
        if (parsed.id === id) {
          localStorage.setItem('hotel_profile', JSON.stringify(responseData));
        }
      }
      
      console.log('Hotel profile updated successfully:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error updating hotel profile:', error);
      throw error;
    }
  },

  // Delete Hotel Profile
  async deleteHotelProfile(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const responseData = await this.handleResponse(response);
      
      // Remove from localStorage if this is the current user's profile
      const currentProfile = localStorage.getItem('hotel_profile');
      if (currentProfile) {
        const parsed = JSON.parse(currentProfile);
        if (parsed.id === id) {
          localStorage.removeItem('hotel_profile');
        }
      }
      
      console.log('Hotel profile deleted successfully:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error deleting hotel profile:', error);
      throw error;
    }
  },

  // Get Hotels by Amenity (for future use when endpoint is uncommented)
  async getHotelsByAmenity(amenity) {
    try {
      const response = await fetch(`${this.BASE_URL}/by-amenity/${encodeURIComponent(amenity)}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const responseData = await this.handleResponse(response);
      console.log('Hotels by amenity retrieved:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Error fetching hotels by amenity:', error);
      throw error;
    }
  },

  // Utility method to get current user's hotel profile from localStorage
  getCurrentHotelProfile() {
    try {
      const profile = localStorage.getItem('hotel_profile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error parsing hotel profile from localStorage:', error);
      return null;
    }
  },

  // Utility method to clear hotel profile from localStorage
  clearCurrentHotelProfile() {
    localStorage.removeItem('hotel_profile');
  }
};

export default HotelProfileService ;