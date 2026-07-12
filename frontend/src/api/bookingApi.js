import api from './axios';

export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my');
export const getAllBookings = (params) => api.get('/bookings', { params });
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const approveBooking = (id) => api.put(`/bookings/${id}/approve`);
export const completeBooking = (id) => api.put(`/bookings/${id}/complete`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
