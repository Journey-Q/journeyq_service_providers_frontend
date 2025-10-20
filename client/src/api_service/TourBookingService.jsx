const TourBookingService = {
  BASE_URL: "https://serviceprovidersservice-production-8f10.up.railway.app/service/tour-bookings",

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

  // Get all bookings by tour guide
  async getBookingsByTourGuide(tourGuideId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/guide/${tourGuideId}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );
      const responseData = await this.handleResponse(response);
      console.log("Fetched tour bookings:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error fetching tour bookings:", error);
      throw error;
    }
  },

  // Get pending approval bookings
  async getPendingBookings(tourGuideId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/guide/${tourGuideId}/pending`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );
      const responseData = await this.handleResponse(response);
      console.log("Fetched pending bookings:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
      throw error;
    }
  },

  // Get approved bookings
  async getApprovedBookings(tourGuideId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/guide/${tourGuideId}/approved`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );
      const responseData = await this.handleResponse(response);
      console.log("Fetched approved bookings:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error fetching approved bookings:", error);
      throw error;
    }
  },

  // Approve a booking
  async approveBooking(bookingId, tourGuideId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/${bookingId}/approve`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ tourGuideId }),
        }
      );
      const responseData = await this.handleResponse(response);
      console.log("Booking approved:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error approving booking:", error);
      throw error;
    }
  },

  // Reject a booking
  async rejectBooking(bookingId, tourGuideId, rejectionReason = null) {
    try {
      const requestBody = { tourGuideId };
      if (rejectionReason) {
        requestBody.rejectionReason = rejectionReason;
      }

      const response = await fetch(
        `${this.BASE_URL}/${bookingId}/reject`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(requestBody),
        }
      );
      const responseData = await this.handleResponse(response);
      console.log("Booking rejected:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error rejecting booking:", error);
      throw error;
    }
  },

  // Complete a booking
  async completeBooking(bookingId, tourGuideId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/${bookingId}/complete`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ tourGuideId }),
        }
      );
      const responseData = await this.handleResponse(response);
      console.log("Booking completed:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error completing booking:", error);
      throw error;
    }
  },

  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/${bookingId}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );
      const responseData = await this.handleResponse(response);
      return responseData;
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw error;
    }
  },
};

export default TourBookingService;