// src/services/templeService.js - 100% REAL MongoDB Backend
import apiClient from './api.js';

const templeService = {
  // ✅ Get all temples - Real API only
  async getAllTemples() {
    try {
      const response = await apiClient.getTemples();
      return response.temples || [];
    } catch (error) {
      console.error('Failed to fetch temples:', error);
      throw error;
    }
  },

  // ✅ Get temple by ID - Real API
  async getTemple(templeId) {
    try {
      const temples = await this.getAllTemples();
      return temples.find(t => t._id === templeId || t.id == templeId) || null;
    } catch (error) {
      console.error('Failed to fetch temple:', error);
      throw error;
    }
  },

  // ✅ Book darshan - Real MongoDB booking
  async bookDarshan(bookingData) {
    try {
      const response = await apiClient.bookDarshan(bookingData);
      return {
        success: true,
        ...response.booking,
        temple: response.booking?.temple || 'Temple'
      };
    } catch (error) {
      console.error('Booking failed:', error);
      throw new Error('Booking failed. Please try again.');
    }
  },

  // ✅ Get user's tokens - Real MongoDB
  async getUserTokens() {
    try {
      const response = await apiClient.getUserTokens();
      return response.tokens || [];
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      return [];
    }
  },

  // ✅ Get user history - Real MongoDB
  async getUserHistory() {
    try {
      const response = await apiClient.getUserHistory();
      return response.tokens || [];
    } catch (error) {
      console.error('Failed to fetch history:', error);
      return [];
    }
  },

  // ✅ Cancel token - Real MongoDB
  async cancelToken(tokenId) {
    try {
      const response = await apiClient.cancelToken(tokenId);
      return response;
    } catch (error) {
      console.error('Cancel failed:', error);
      throw new Error('Failed to cancel token');
    }
  },

  // ✅ Live queue status (mock for now - add to backend later)
  async getQueueStatus(templeId) {
    return {
      templeId,
      currentQueue: 0,
      estimatedWait: '0 mins',
      nextAvailable: new Date(Date.now() + 3600000).toLocaleTimeString()
    };
  }
};

export default templeService;
