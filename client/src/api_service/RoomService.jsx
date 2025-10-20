// RoomService.js

const RoomService = {
  //base api url
  BASE_URL: 'https://serviceprovidersservice-production-8f10.up.railway.app/service/rooms',

  // Helper method to get auth headers
  getAuthHeaders() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
  },

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  },

  // **CREATE ROOM**
  async createRoom(roomData){
    try{
      const response = await fetch(`${this.BASE_URL}/create`,{
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(roomData)
      });

      const responseData = await this.handleResponse(response);
      console.log('Room created successfully:', responseData);

      return responseData;
    }catch(error){
      console.error('Error creating room:', error);
      throw error;
    }
  },

  async editRoom(id, roomData){
    try{
      const response = await fetch(`${this.BASE_URL}/${id}`,{
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(roomData)
      });

      const responseData = await this.handleResponse(response);
      console.log('Room edited successfully:', responseData);
    }catch(error){
      console.error('Error editing room:', error);
      throw error;
    }
  },

  //delete room
  async deleteRoom(id){
    try{
      const response = await fetch(`${this.BASE_URL}/${id}`,{
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const responseData = await this.handleResponse(response);
      console.log('Room deleted successfully:', responseData);
      return responseData;
    }catch(error){
      console.error('Error deleting room:', error);
      throw error;
    }
  },

  // Get room by ID (Retained)
  async getRoomById(id){
    try{
      const response = await fetch(`${this.BASE_URL}/${id}`,{
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const responseData = await this.handleResponse(response);
      console.log('Room data fetched successfully:', responseData);
      return responseData;
    }catch(error){
      console.error('Error fetching room data:', error);
      throw error;
    }
  },

  // Get rooms by service provider ID (Retained)
  async getRoomsByServiceProviderId(serviceProviderId){
    try{
      const response = await fetch(`${this.BASE_URL}/service-provider/${serviceProviderId}`,{
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const responseData = await this.handleResponse(response);
      console.log('Rooms fetched successfully:', responseData);
      return responseData;
    }catch(error){
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }
}

export default RoomService;