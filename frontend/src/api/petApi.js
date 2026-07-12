import api from './axios';

export const getAvailablePets = (params) => api.get('/pets', { params });
export const getPet = (id) => api.get(`/pets/${id}`);
export const getAllPetsAdmin = (params) => api.get('/pets/admin/all', { params });
export const createPet = (formData) => api.post('/pets', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const updatePet = (id, formData) => api.put(`/pets/${id}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const deletePet = (id) => api.delete(`/pets/${id}`);
