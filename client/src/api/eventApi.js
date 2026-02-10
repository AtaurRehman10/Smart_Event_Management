import axiosClient from './axiosClient';

export const eventApi = {
     getAll: (params) => axiosClient.get('/events', { params }),
     getById: (id) => axiosClient.get(`/events/${id}`),
     create: (data) => axiosClient.post('/events', data),
     update: (id, data) => axiosClient.put(`/events/${id}`, data),
     delete: (id) => axiosClient.delete(`/events/${id}`),
     duplicate: (id) => axiosClient.post(`/events/${id}/duplicate`),
     getDashboard: (id) => axiosClient.get(`/events/${id}/dashboard`),
};
