import api from './axios';

export const getApprovedReviews = () => api.get('/reviews');
export const getAllReviews = (params) => api.get('/reviews/all', { params });
export const createReview = (data) => api.post('/reviews', data);
export const approveReview = (id) => api.put(`/reviews/${id}/approve`);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
