import api from './apiService';

const productionApi = {
  // Production Batches
  getProductionBatches: async (params = {}) => {
    try {
      const response = await api.get('/production-batches/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductionBatchById: async (id) => {
    try {
      const response = await api.get(`/production-batches/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createProductionBatch: async (batchData) => {
    try {
      const response = await api.post('/production-batches/', batchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProductionBatch: async (id, batchData) => {
    try {
      const response = await api.put(`/production-batches/${id}`, batchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Production Reports
  getProductionReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/production', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Raw Material Consumption
  getRawMaterialConsumption: async (params = {}) => {
    try {
      const response = await api.get('/reports/raw-material-consumption', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Production Losses
  getProductionLosses: async (params = {}) => {
    try {
      const response = await api.get('/reports/production-losses', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Production Efficiency
  getProductionEfficiency: async (params = {}) => {
    try {
      const response = await api.get('/reports/production-efficiency', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productionApi;
