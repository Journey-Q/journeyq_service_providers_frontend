const HotelBookingService = {
  BASE_URL: "https://serviceprovidersservice-production-8f10.up.railway.app/service/room-bookings",

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

  // Get bookings by service provider (hotel)
  async getBookingsByServiceProvider(serviceProviderId) {
    const response = await fetch(`${this.BASE_URL}/provider/${serviceProviderId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  },

  // Get booking by ID
  async getBookingById(bookingId) {
    const response = await fetch(`${this.BASE_URL}/${bookingId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  },

  // Cancel a booking
  async cancelBooking(bookingId, cancellationReason = null) {
    const body = cancellationReason ? 
      { cancellationReason } : 
      {};
    
    const response = await fetch(`${this.BASE_URL}/${bookingId}/cancel`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  },

  // Confirm a booking
  async confirmBooking(bookingId) {
    const response = await fetch(`${this.BASE_URL}/${bookingId}/confirm`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  },

  // Complete a booking (check-out)
  async completeBooking(bookingId) {
    const response = await fetch(`${this.BASE_URL}/${bookingId}/complete`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
};

export default HotelBookingService;