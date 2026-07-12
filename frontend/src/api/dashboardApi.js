import api from './axios';

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getDashboardChart = () => api.get('/dashboard/chart');
export const getDashboardRecentUsers = () => api.get('/dashboard/recent-users');
export const getDashboardRecentBookings = () => api.get('/dashboard/recent-bookings');
export const getDashboardActivities = (params) => api.get('/dashboard/activities', { params });
