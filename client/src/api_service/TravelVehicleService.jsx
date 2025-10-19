const TravelVehicleService = {
  BASE_URL:
    "https://serviceprovidersservice-production-8f10.up.railway.app/service/vehicles",

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

  // Create a new vehicle
  async createVehicle(vehicleData) {
    try {
      const response = await fetch(`${this.BASE_URL}/create`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });

      const responseData = await this.handleResponse(response);
      console.log("Vehicle created successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      throw error;
    }
  },

  // Get vehicles by service provider id
  async getVehiclesByServiceProviderId(serviceProviderId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/service-provider/${serviceProviderId}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      const responseData = await this.handleResponse(response);
      console.log("Vehicles fetched successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },

  // Update vehicle by id
  async updateVehicle(vehicleId, vehicleData) {
    try {
      const response = await fetch(`${this.BASE_URL}/${vehicleId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });

      const responseData = await this.handleResponse(response);
      console.log("Vehicle updated successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error updating vehicle:", error);
      throw error;
    }
  },

  // Delete vehicle by id
  async deleteVehicle(vehicleId) {
    try {
      const response = await fetch(`${this.BASE_URL}/${vehicleId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      const responseData = await this.handleResponse(response);
      console.log("Vehicle deleted successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      throw error;
    }
  },

  // Get vehicle by id
  async getVehicleById(vehicleId) {
    try {
      const response = await fetch(`${this.BASE_URL}/${vehicleId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const responseData = await this.handleResponse(response);
      console.log("Vehicle fetched successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      throw error;
    }
  },
};

// Export the service
export default TravelVehicleService;
