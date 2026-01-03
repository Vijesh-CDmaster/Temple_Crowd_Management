// src/services/api.js - Connected to YOUR MongoDB Backend (localhost:5000)
const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = {
  // Universal request handler
  async request(config) {
    const { url, method = 'GET', data = null, headers = {} } = config;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: defaultHeaders,
      body: data ? JSON.stringify(data) : null
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  },

  // Auth endpoints (mock for demo - connect later)
  async login(credentials) {
    // Mock success for demo
    return {
      success: true,
      token: 'mock-jwt-token-123',
      user: { id: 'demo-user', name: 'Devotee' }
    };
  },

  async register(userData) {
    return {
      success: true,
      message: 'Registration successful',
      user: userData
    };
  },

  // ✅ REAL Temple endpoints (YOUR MongoDB backend)
  async getTemples() {
    return this.request({ url: '/temples' });
  },

  async getTempleSlots(templeId) {
    // Forward to backend if needed
    return this.request({ url: `/temples/${templeId}` });
  },

  async bookDarshan(bookingData) {
    return this.request({
      url: '/bookings',
      method: 'POST',
      data: bookingData
    });
  },

  // ✅ REAL Token endpoints (YOUR MongoDB backend)
  async getUserTokens(userId = 'current') {
    return this.request({ url: '/tokens' });
  },

  async getUserHistory(userId = 'current') {
    return this.request({ url: '/tokens' }); // Same as tokens for history
  },

  // ✅ NEW: Cancel Token
  async cancelToken(tokenId) {
    return this.request({
      url: `/bookings/${tokenId}/cancel`,
      method: 'PATCH'
    });
  }
};

export default apiClient;
