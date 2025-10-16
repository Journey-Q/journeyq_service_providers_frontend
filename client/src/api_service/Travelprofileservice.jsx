const TravelAgencyProfileService = {
  BASE_URL: 'https://serviceprovidersservice-production-7996.up.railway.app/service/agency-profiles',

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
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  },

  async createProfile(profileData) {
    try {
      const response = await fetch(`${this.BASE_URL}/create`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      const responseData = await this.handleResponse(response);
      localStorage.setItem('travel_agency_profile', JSON.stringify(responseData));
      console.log('Travel agency profile created successfully:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Error creating travel agency profile:', error);
      throw error;
    }
  },

  async getProfile(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching travel agency profile:', error);
      throw error;
    }
  },

  async getAllProfiles() {
    try {
      const response = await fetch(`${this.BASE_URL}/all`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching all travel agency profiles:', error);
      throw error;
    }
  },

  async updateProfile(id, profileData) {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      const responseData = await this.handleResponse(response);
      
      const currentProfile = localStorage.getItem('travel_agency_profile');
      if (currentProfile) {
        const parsed = JSON.parse(currentProfile);
        if (parsed.id === id) {
          localStorage.setItem('travel_agency_profile', JSON.stringify(responseData));
        }
      }
      
      return responseData;
    } catch (error) {
      console.error('Error updating travel agency profile:', error);
      throw error;
    }
  },

  async deleteProfile(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      await this.handleResponse(response);
      
      const currentProfile = localStorage.getItem('travel_agency_profile');
      if (currentProfile) {
        const parsed = JSON.parse(currentProfile);
        if (parsed.id === id) {
          localStorage.removeItem('travel_agency_profile');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting travel agency profile:', error);
      throw error;
    }
  },

  getCurrentProfile() {
    try {
      const profile = localStorage.getItem('travel_agency_profile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error parsing travel agency profile from localStorage:', error);
      return null;
    }
  },

  clearCurrentProfile() {
    localStorage.removeItem('travel_agency_profile');
  }
};

export default TravelAgencyProfileService;