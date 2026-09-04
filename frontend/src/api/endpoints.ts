import api from './axios';

export const categoryApi = {
  getAll: (params?: any) => api.get('/categories', { params }),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const productApi = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const batchApi = {
  getAll: (params?: any) => api.get('/batches', { params }),
  getById: (id: string) => api.get(`/batches/${id}`),
  create: (data: any) => api.post('/batches', data),
  update: (id: string, data: any) => api.put(`/batches/${id}`, data),
  delete: (id: string) => api.delete(`/batches/${id}`),
};

export const inventoryApi = {
  getAll: (params?: any) => api.get('/inventories', { params }),
  getById: (id: string) => api.get(`/inventories/${id}`),
};

export const wasteApi = {
  create: (data: any) => api.post('/waste-records', data),
};

export const businessApi = {
  getAll: (params?: any) => api.get('/business-entities', { params }),
  getById: (id: string) => api.get(`/business-entities/${id}`),
  createRequest: (data: any) => api.post('/business-entities/requests', data),
  approve: (id: string) => api.post(`/business-entities/${id}/approve`),
};

export const purchaseApi = {
  getAll: (params?: any) => api.get('/purchases', { params }),
  getById: (id: string) => api.get(`/purchases/${id}`),
  create: (data: any) => api.post('/purchases', data),
  updateStatus: (id: string, status: string) => api.patch(`/purchases/${id}/status`, null, { params: { status } }),
};

export const saleApi = {
  getAll: (params?: any) => api.get('/sales', { params }),
  getById: (id: string) => api.get(`/sales/${id}`),
  create: (data: any) => api.post('/sales', data),
  updateStatus: (id: string, status: string) => api.patch(`/sales/${id}/status`, null, { params: { status } }),
};

export const traceabilityApi = {
  getByBatchId: (id: string) => api.get(`/traceability/batches/${id}`),
  getByBatchCode: (code: string) => api.get(`/traceability/batches/code/${code}`),
};
