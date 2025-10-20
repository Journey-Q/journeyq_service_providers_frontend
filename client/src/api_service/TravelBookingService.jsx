const TravelBookingService = {
  BASE_URL: "https://serviceprovidersservice-production-8f10.up.railway.app/service/vehicle-bookings",

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

  // Get bookings by travel agency
  async getBookingsByTravelAgency(travelAgencyId) {
    const response = await fetch(`${this.BASE_URL}/agency/${travelAgencyId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  },

  // Get pending approval bookings for travel agency
  async getPendingBookings(travelAgencyId) {
    const response = await fetch(`${this.BASE_URL}/agency/${travelAgencyId}/pending`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  },

  // Get approved bookings for travel agency
  async getApprovedBookings(travelAgencyId) {
    const response = await fetch(`${this.BASE_URL}/agency/${travelAgencyId}/approved`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  },

  // Get upcoming bookings for travel agency
  async getUpcomingBookings(travelAgencyId) {
    const response = await fetch(`${this.BASE_URL}/agency/${travelAgencyId}/upcoming`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  },

  // Approve a booking
  async approveBooking(bookingId, travelAgencyId) {
    const response = await fetch(`${this.BASE_URL}/${bookingId}/approve`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ travelAgencyId }),
    });
    return this.handleResponse(response);
  },

  // Reject a booking
  async rejectBooking(bookingId, travelAgencyId, rejectionReason = null) {
    const body = rejectionReason ? 
      { travelAgencyId, rejectionReason } : 
      { travelAgencyId };
    
    const response = await fetch(`${this.BASE_URL}/${bookingId}/reject`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  },

  // Complete a booking
  async completeBooking(bookingId, travelAgencyId) {
    const response = await fetch(`${this.BASE_URL}/${bookingId}/complete`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ travelAgencyId }),
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

  // Get bookings by vehicle
  async getBookingsByVehicle(vehicleId) {
    const response = await fetch(`${this.BASE_URL}/vehicle/${vehicleId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
};

export default TravelBookingService;