import apiService from '../apiService';

export default {
  // Purchase Management
  async getPurchases() {
    return await apiService.get('/purchases');
  },

  async getPurchase(id) {
    return await apiService.get(`/purchases/${id}`);
  },

  async addPurchase(data) {
    return await apiService.post('/purchases', data);
  },

  async updatePurchase(id, data) {
    return await apiService.put(`/purchases/${id}`, data);
  },

  async deletePurchase(id) {
    return await apiService.delete(`/purchases/${id}`);
  },

  // Supplier Management
  async getSuppliers() {
    return await apiService.get('/suppliers');
  },

  async getSupplier(id) {
    return await apiService.get(`/suppliers/${id}`);
  },

  async addSupplier(data) {
    return await apiService.post('/suppliers', data);
  },

  async updateSupplier(id, data) {
    return await apiService.put(`/suppliers/${id}`, data);
  },

  async deleteSupplier(id) {
    return await apiService.delete(`/suppliers/${id}`);
  },

  // Document Import
  async importDocument(file) {
    const formData = new FormData();
    formData.append('document', file);
    return await apiService.post('/purchases/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
