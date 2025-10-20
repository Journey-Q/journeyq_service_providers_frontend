const PromotionService = {
  BASE_URL:
    "https://serviceprovidersservice-production-8f10.up.railway.app/service/promotions",

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

  //create promotion
  async createPromotion(promotionData) {
    try {
      const response = await fetch(`${this.BASE_URL}/create`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(promotionData),
      });
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error creating promotion:", error);
      throw error;
    }
  },

  //get promotions by service provider id
  async getPromotionsByServiceProviderId(serviceProviderId) {
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
      console.error("Error fetching promotions:", error);
      throw error;
    }
  },

  //delete promotion
  async deletePromotion(promotionId) {
    try {
      const response = await fetch(`${this.BASE_URL}/${promotionId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error deleting promotion:", error);
      throw error;
    }
  },

  //edit promotion
  async editPromotion(promotionId, updatedData) {
    try {
      const response = await fetch(`${this.BASE_URL}/${promotionId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updatedData),
      });
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error editing promotion:", error);
      throw error;
    }
  },
};

export default PromotionService;
