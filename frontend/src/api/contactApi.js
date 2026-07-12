import api from './axios';

export const submitMessage = (data) => api.post('/contact', data);
export const getMessages = (params) => api.get('/contact', { params });
export const markAsRead = (id) => api.put(`/contact/${id}/read`);
export const deleteMessage = (id) => api.delete(`/contact/${id}`);
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);
