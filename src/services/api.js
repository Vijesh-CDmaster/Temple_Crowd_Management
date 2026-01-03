const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.templeconnect.in/v1';

const apiClient = {
  // Create axios-like request handler
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
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  // Auth endpoints
  async login(credentials) {
    return this.request({
      url: '/auth/login',
      method: 'POST',
      data: credentials
    });
  },

  async register(userData) {
    return this.request({
      url: '/auth/register',
      method: 'POST',
      data: userData
    });
  },

  // Temple endpoints
  async getTemples() {
    return this.request({ url: '/temples' });
  },

  async getTempleSlots(templeId) {
    return this.request({ url: `/temples/${templeId}/slots` });
  },

  async bookDarshan(bookingData) {
    return this.request({
      url: '/bookings',
      method: 'POST',
      data: bookingData
    });
  },

  // User endpoints
  async getUserTokens(userId) {
    return this.request({ url: `/users/${userId}/tokens` });
  },

  async getUserHistory(userId) {
    return this.request({ url: `/users/${userId}/history` });
  }
};

export default apiClient;
