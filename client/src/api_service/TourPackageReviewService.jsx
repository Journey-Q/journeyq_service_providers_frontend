const TourPackageReviewService = {
    BASE_URL: 'https://serviceprovidersservice-production-8f10.up.railway.app/service/tour-package-reviews',

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
      localStorage.setItem('tour_guide_profile', JSON.stringify(responseData));
      console.log('Tour guide profile created successfully:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Error creating tour guide profile:', error);
      throw error;
    }
  },

  //get review by tour package id
  async getReviewsByTourPackageId(tourId){
    try {
      const response = await fetch(`${this.BASE_URL}/tour/${tourId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
        return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching reviews for tour package:', error);
      throw error;
    }
  }

  
  
}

///service/tour-package-reviews/tour/{tourId}/stats - Get review statistics
///service/tour-package-reviews/tour/{tourId} - Get all reviews for a tour