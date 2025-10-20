const TourPackageService = {
  BASE_URL:
    "https://serviceprovidersservice-production-8f10.up.railway.app/service/tours",

  // Helper method to get auth headers
  getAuthHeaders() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please login again.");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
  },

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Handle different response types
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  },

  //get tour package by service provider id
  async getTourPackagesByServiceProviderId(serviceProviderId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/service-provider/${serviceProviderId}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error fetching tour packages:", error);
      throw error;
    }
  },

  //create tour package
  async createTourPackage(tourPackageData) {
    try {
      const response = await fetch(`${this.BASE_URL}/create`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(tourPackageData),
      });
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error creating tour package:", error);
      throw error;
    }
  },

  //update tour package
  async updateTourPackage(tourPackageId, tourPackageData) {
    try {
      const response = await fetch(`${this.BASE_URL}/${tourPackageId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(tourPackageData),
      });
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error updating tour package:", error);
      throw error;
    }
  },

  //delete tour package
  async deleteTourPackage(tourPackageId) {
    try {
      const response = await fetch(`${this.BASE_URL}/${tourPackageId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error deleting tour package:", error);
      throw error;
    }
  },

  // PAST TOUR IMAGES ENDPOINTS

  // Add past tour images for a tour
  async addPastTourImages(tourId, imageUrls) {
    try {
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("At least one image URL is required");
      }

      // Send all image URLs in a single request as an array
      const requestBody = {
        imageUrls: imageUrls
      };

      console.log('Sending past tour images request:', {
        tourId,
        imageUrls,
        requestBody
      });

      const response = await fetch(`${this.BASE_URL}/${tourId}/past-images`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });
      
      const result = await this.handleResponse(response);
      console.log('Past tour images added successfully:', result);
      return result;
    } catch (error) {
      console.error("Error adding past tour images:", error);
      throw error;
    }
  },

  // Get all past tour images for a tour
  async getPastTourImages(tourId) {
    try {
      const response = await fetch(`${this.BASE_URL}/${tourId}/past-images`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error fetching past tour images:", error);
      throw error;
    }
  },

  // Update a specific past tour image
  async updatePastTourImage(imageId, imageUrl) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/past-images/${imageId}?imageUrl=${encodeURIComponent(imageUrl)}`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
        }
      );
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error updating past tour image:", error);
      throw error;
    }
  },

  // Delete a specific past tour image
  async deletePastTourImage(imageId) {
    try {
      const response = await fetch(`${this.BASE_URL}/past-images/${imageId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error deleting past tour image:", error);
      throw error;
    }
  },

  // Delete all past tour images for a tour
  async deleteAllPastTourImages(tourId) {
    try {
      const response = await fetch(`${this.BASE_URL}/${tourId}/past-images`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error deleting all past tour images:", error);
      throw error;
    }
  },

  // Get count of past tour images for a tour
  async getPastTourImagesCount(tourId) {
    try {
      const response = await fetch(`${this.BASE_URL}/${tourId}/past-images/count`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error fetching past tour images count:", error);
      throw error;
    }
  }
};

export default TourPackageService;