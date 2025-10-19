const BankDetailsService = {
    BASE_URL: 'https://serviceprovidersservice-production-8f10.up.railway.app/service/bank-details',

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

  // Get bank details by service provider id
    async getBankDetailsByServiceProviderId(serviceProviderId) {
        try {
            const response = await fetch(
                `${this.BASE_URL}/service-provider/${serviceProviderId}`,
                {
                    method: "GET",
                    headers: this.getAuthHeaders(),
                }
            );  
            const responseData = await this.handleResponse(response);
            console.log("Bank details fetched successfully:", responseData);
            return responseData;
        } catch (error) {
            console.error("Error fetching bank details:", error);
            throw error;
        }
    },

    //create bank details
    async createBankDetails(bankDetails) {
        try {
            const response = await fetch(
                `${this.BASE_URL}/create`,
                {
                    method: "POST",
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify(bankDetails),
                }
            );
            const responseData = await this.handleResponse(response);
            console.log("Bank details created successfully:", responseData);
            return responseData;
        } catch (error) {
            console.error("Error creating bank details:", error);
            throw error;
        }
    },
    
    //edit bank details
    async editBankDetails(id, bankDetails) {
        try {
            const response = await fetch(
                `${this.BASE_URL}/service-provider/${id}`,
                {
                    method: "PUT",
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify(bankDetails),
                }
            );
            const responseData = await this.handleResponse(response);
            console.log("Bank details updated successfully:", responseData);
            return responseData;
        } catch (error) {
            console.error("Error updating bank details:", error);
            throw error;
        }
    },
}

export default BankDetailsService