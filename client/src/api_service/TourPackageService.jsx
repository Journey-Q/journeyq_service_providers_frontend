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

  // Add past tour photos to existing tour
  async addPastTourPhotos(tourPackageId, imageUrls) {
    try {
      // First, get the existing tour data
      const response = await fetch(`${this.BASE_URL}/${tourPackageId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      const existingTour = await this.handleResponse(response);

      // Get existing pastTourImages or initialize empty array
      const existingImages = existingTour.pastTourImages || [];
      
      // Calculate the next orderIndex
      const maxOrderIndex = existingImages.length > 0 
        ? Math.max(...existingImages.map(img => img.orderIndex))
        : -1;

      // Create new image objects with proper structure
      const newImages = imageUrls.map((url, index) => ({
        imageUrl: url,
        orderIndex: maxOrderIndex + 1 + index
      }));

      // Combine existing and new images
      const allImages = [...existingImages, ...newImages];

      // Prepare update data - only send the fields needed for the update
      const updateData = {
        ...existingTour,
        pastTourImages: allImages
      };

      // Update the tour with new images
      return await this.updateTourPackage(tourPackageId, updateData);
    } catch (error) {
      console.error("Error adding past tour photos:", error);
      throw error;
    }
  },
};

export default TourPackageService;