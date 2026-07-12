import api from './axios';

export const getServices = (params) => api.get('/services', { params });
export const getService = (slug) => api.get(`/services/${slug}`);
export const getAllServicesAdmin = (params) => api.get('/services/admin/all', { params });
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);
