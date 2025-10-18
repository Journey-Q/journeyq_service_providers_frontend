const HotelBookingService = {
  //base api url
  BASE_URL:
    "https://serviceprovidersservice-production-8f10.up.railway.app/service/hotel-profiles",

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

    //fetch all bookings for a hotel
    async fetchHotelBookings(hotelId) {
      try {
        const response = await fetch(
          `${this.BASE_URL}/${hotelId}/bookings`,
          {
            method: "GET",
            headers: this.getAuthHeaders(),
          }
        );
        const responseData = await this.handleResponse(response);
        console.log("Fetched hotel bookings:", responseData);
        return responseData;
      } catch (error) {
        console.error("Error fetching hotel bookings:", error);
        throw error;
      }
    },

    
};
