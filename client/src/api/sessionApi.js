import axiosClient from './axiosClient';

export const sessionApi = {
     getByEvent: (eventId) => axiosClient.get(`/sessions/event/${eventId}`),
     create: (data) => axiosClient.post('/sessions', data),
     update: (id, data) => axiosClient.put(`/sessions/${id}`, data),
     delete: (id) => axiosClient.delete(`/sessions/${id}`),
     join: (id) => axiosClient.post(`/sessions/${id}/join`),
     leave: (id) => axiosClient.post(`/sessions/${id}/leave`),
     checkConflicts: (data) => axiosClient.post('/sessions/check-conflicts', data),
};
