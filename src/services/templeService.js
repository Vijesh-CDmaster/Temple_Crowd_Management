import apiClient from './api.js';

// Mock data for development (replace with real API calls)
const mockTemples = {
  somnath: {
    id: 1,
    name: 'Somnath Temple',
    location: 'Veraval, Gujarat',
    slots: [
      { time: '10:30 AM', slotsLeft: 45, price: 50 },
      { time: '12:00 PM', slotsLeft: 23, price: 50 },
      { time: '2:30 PM', slotsLeft: 67, price: 100 }
    ]
  },
  dwarka: {
    id: 2,
    name: 'Dwarka Temple',
    location: 'Dwarka, Gujarat',
    slots: [
      { time: '9:00 AM', slotsLeft: 34, price: 75 },
      { time: '11:30 AM', slotsLeft: 56, price: 75 }
    ]
  }
};

// Temple service methods
const templeService = {
  // Get all temples
  async getAllTemples() {
    try {
      // Real API call
      return await apiClient.getTemples();
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock temple data:', error.message);
      return [
        mockTemples.somnath,
        mockTemples.dwarka,
        {
          id: 3,
          name: 'Akshardham Temple',
          location: 'Gandhinagar, Gujarat',
          slots: [{ time: '11:00 AM', slotsLeft: 89, price: 30 }]
        }
      ];
    }
  },

  // Get temple by ID or name
  async getTemple(templeId) {
    try {
      return await apiClient.getTempleSlots(templeId);
    } catch (error) {
      console.warn('Using mock temple slots');
      return mockTemples[templeId === 1 ? 'somnath' : 'dwarka'];
    }
  },

  // Book darshan slot
  async bookDarshan(bookingData) {
    try {
      const response = await apiClient.bookDarshan(bookingData);
      
      // Generate token format: TKN-YYYYMMDD-XXX
      const token = `TKN-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*999).toString().padStart(3,'0')}`;
      
      return {
        ...response,
        token,
        status: 'active',
        qrCode: `QR_${token}`
      };
    } catch (error) {
      // Mock successful booking for demo
      return {
        success: true,
        token: `TKN-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*999).toString().padStart(3,'0')}`,
        status: 'active'
      };
    }
  },

  // Get live queue status
  async getQueueStatus(templeId) {
    // Simulate real-time queue data
    return {
      templeId,
      currentQueue: Math.floor(Math.random() * 500),
      estimatedWait: `${Math.floor(Math.random() * 120)} mins`,
      nextAvailable: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString()
    };
  },

  // Get user's tokens
  async getUserTokens() {
    try {
      return await apiClient.getUserTokens('current');
    } catch (error) {
      // Mock tokens
      return [
        {
          id: 1,
          temple: 'Somnath Temple',
          time: '10:30 AM',
          token: 'TKN-20260104-001',
          status: 'active',
          expiry: new Date(Date.now() + 24*60*60*1000)
        }
      ];
    }
  }
};

export default templeService;
