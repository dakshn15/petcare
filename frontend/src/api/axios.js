import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Response interceptor to handle errors, token expiration and redirects
instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is due to expired access token
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try to refresh token
        const refreshRes = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
        if (refreshRes.data?.success) {
          // Retry original request with refreshed token cookie
          return instance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login/clear auth
        window.dispatchEvent(new CustomEvent('unauthorized'));
        return Promise.reject(refreshError);
      }
    }
    
    // Normalize error message
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default instance;
