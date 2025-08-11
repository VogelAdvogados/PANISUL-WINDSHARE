import api from './apiService';

const clientsApi = {
  // Clients
  getClients: async (params = {}) => {
    try {
      const response = await api.get('/clients/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getClientById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createClient: async (clientData) => {
    try {
      const response = await api.post('/clients/', clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateClient: async (id, clientData) => {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteClient: async (id) => {
    try {
      await api.delete(`/clients/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Client History
  getClientHistory: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Client Credits
  getClientCredits: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/credits`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Client Purchases
  getClientPurchases: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/purchases`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Client Returns
  getClientReturns: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/returns`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default clientsApi;
