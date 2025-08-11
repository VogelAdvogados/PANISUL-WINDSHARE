import api from './apiService';

const salesApi = {
  // Sales
  getSales: async (params = {}) => {
    try {
      const response = await api.get('/sales/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSaleById: async (id) => {
    try {
      const response = await api.get(`/sales/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSale: async (saleData) => {
    try {
      const response = await api.post('/sales/', saleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSale: async (id, saleData) => {
    try {
      const response = await api.put(`/sales/${id}`, saleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Returns
  createReturn: async (saleId, returnData) => {
    try {
      const response = await api.post(`/sales/${saleId}/returns`, returnData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Credits
  getCredits: async (params = {}) => {
    try {
      const response = await api.get('/credits/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCredit: async (creditData) => {
    try {
      const response = await api.post('/credits/', creditData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCredit: async (id, creditData) => {
    try {
      const response = await api.put(`/credits/${id}`, creditData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sales Reports
  getSalesReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/sales', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default salesApi;
