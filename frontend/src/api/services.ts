import apiClient from './client';

// サービスマスタAPI
export const servicesApi = {
  getAll: (params?: any) => apiClient.get('/services', { params }),
  getById: (id: string | number) => apiClient.get(`/services/${id}`),
  create: (data: any) => apiClient.post('/services', data),
  update: (id: string | number, data: any) => apiClient.put(`/services/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/services/${id}`)
};

// 一般ルールAPI
export const rulesGeneralApi = {
  getAll: (params?: any) => apiClient.get('/rules/general', { params }),
  getById: (id: string | number) => apiClient.get(`/rules/general/${id}`),
  create: (data: any) => apiClient.post('/rules/general', data),
  update: (id: string | number, data: any) => apiClient.put(`/rules/general/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/rules/general/${id}`)
};

// 力学ルールAPI
export const rulesForceApi = {
  getAll: (params?: any) => apiClient.get('/rules/force', { params }),
  getById: (id: string | number) => apiClient.get(`/rules/force/${id}`),
  create: (data: any) => apiClient.post('/rules/force', data),
  update: (id: string | number, data: any) => apiClient.put(`/rules/force/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/rules/force/${id}`)
};

// 校正依頼（見積）API
export const calibrationApi = {
  getAllRequests: (params?: any) => apiClient.get('/calibration/requests', { params }),
  getRequestById: (id: string | number) => apiClient.get(`/calibration/requests/${id}`),
  createRequest: (data: any) => apiClient.post('/calibration/requests', data),
  updateRequest: (id: string | number, data: any) => apiClient.put(`/calibration/requests/${id}`, data),
  deleteRequest: (id: string | number) => apiClient.delete(`/calibration/requests/${id}`),

  addItem: (requestId: string | number, data: any) => apiClient.post(`/calibration/requests/${requestId}/items`, data),
  updateItem: (requestId: string | number, itemId: string | number, data: any) => apiClient.put(`/calibration/requests/${requestId}/items/${itemId}`, data),
  deleteItem: (requestId: string | number, itemId: string | number) => apiClient.delete(`/calibration/requests/${requestId}/items/${itemId}`)
};
