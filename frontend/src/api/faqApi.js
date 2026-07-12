import api from './axios';

export const getFAQs = () => api.get('/faqs');
export const getAllFAQs = () => api.get('/faqs/all');
export const createFAQ = (data) => api.post('/faqs', data);
export const updateFAQ = (id, data) => api.put(`/faqs/${id}`, data);
export const deleteFAQ = (id) => api.delete(`/faqs/${id}`);
