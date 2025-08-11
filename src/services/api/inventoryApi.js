import api from './apiService';

const inventoryApi = {
  // Raw Materials
  getRawMaterials: async (params = {}) => {
    try {
      const response = await api.get('/raw-materials/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRawMaterialById: async (id) => {
    try {
      const response = await api.get(`/raw-materials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createRawMaterial: async (materialData) => {
    try {
      const response = await api.post('/raw-materials/', materialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateRawMaterial: async (id, materialData) => {
    try {
      const response = await api.put(`/raw-materials/${id}`, materialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteRawMaterial: async (id) => {
    try {
      await api.delete(`/raw-materials/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Production Batches
  getProductionBatches: async (params = {}) => {
    try {
      const response = await api.get('/production-batches/', { params });
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

  // Inventory Alerts
  getInventoryAlerts: async () => {
    try {
      const response = await api.get('/inventory/alerts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default inventoryApi;
