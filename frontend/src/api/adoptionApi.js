import api from './axios';

export const submitApplication = (data) => api.post('/adoptions', data);
export const getMyAdoptions = () => api.get('/adoptions/my');
export const getAllApplications = (params) => api.get('/adoptions', { params });
export const approveApplication = (id) => api.put(`/adoptions/${id}/approve`);
export const rejectApplication = (id) => api.put(`/adoptions/${id}/reject`);
