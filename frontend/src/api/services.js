import apiClient from './client';

// サービスマスタAPI
export const servicesApi = {
  getAll: (params) => apiClient.get('/services', { params }),
  getById: (id) => apiClient.get(`/services/${id}`),
  create: (data) => apiClient.post('/services', data),
  update: (id, data) => apiClient.put(`/services/${id}`, data),
  delete: (id) => apiClient.delete(`/services/${id}`)
};

// 一般ルールAPI
export const rulesGeneralApi = {
  getAll: (params) => apiClient.get('/rules/general', { params }),
  getById: (id) => apiClient.get(`/rules/general/${id}`),
  create: (data) => apiClient.post('/rules/general', data),
  update: (id, data) => apiClient.put(`/rules/general/${id}`, data),
  delete: (id) => apiClient.delete(`/rules/general/${id}`)
};

// 力学ルールAPI
export const rulesForceApi = {
  getAll: (params) => apiClient.get('/rules/force', { params }),
  getById: (id) => apiClient.get(`/rules/force/${id}`),
  create: (data) => apiClient.post('/rules/force', data),
  update: (id, data) => apiClient.put(`/rules/force/${id}`, data),
  delete: (id) => apiClient.delete(`/rules/force/${id}`)
};

// 校正依頼（見積）API
export const calibrationApi = {
  getAllRequests: (params) => apiClient.get('/calibration/requests', { params }),
  getRequestById: (id) => apiClient.get(`/calibration/requests/${id}`),
  createRequest: (data) => apiClient.post('/calibration/requests', data),
  updateRequest: (id, data) => apiClient.put(`/calibration/requests/${id}`, data),
  deleteRequest: (id) => apiClient.delete(`/calibration/requests/${id}`),

  addItem: (requestId, data) => apiClient.post(`/calibration/requests/${requestId}/items`, data),
  updateItem: (requestId, itemId, data) => apiClient.put(`/calibration/requests/${requestId}/items/${itemId}`, data),
  deleteItem: (requestId, itemId) => apiClient.delete(`/calibration/requests/${requestId}/items/${itemId}`)
};
