const TravelDriverService = {
  BASE_URL: 'https://serviceprovidersservice-production-8f10.up.railway.app/service/drivers',

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

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  },

  // Get all drivers by service provider id
  async getDriversByServiceProviderId(serviceProviderId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/service-provider/${serviceProviderId}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      const responseData = await this.handleResponse(response);
      console.log("Drivers fetched successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error fetching drivers:", error);
      throw error;
    }
  },

  // Add new driver
  async createVehicle(driverData) {
    try {
      const response = await fetch(`${this.BASE_URL}/create`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(driverData),
      });

      const responseData = await this.handleResponse(response);
      console.log("Driver added successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      throw error;
    }
  },

  //edit driver
  async editDriver(id, driverData) {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(driverData),
      });
      const responseData = await this.handleResponse(response);
      console.log("Driver edited successfully:", responseData);
    } catch (error) {
      console.error("Error editing driver:", error);
      throw error;
    }
  },

  // Delete driver
  async deleteDriver(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      const responseData = await this.handleResponse(response);
      console.log("Driver deleted successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error deleting driver:", error);
      throw error;
    }
  },
};

export default TravelDriverService;