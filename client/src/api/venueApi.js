import axiosClient from './axiosClient';

export const venueApi = {
     getByEvent: (eventId) => axiosClient.get(`/venues/event/${eventId}`),
     create: (data) => axiosClient.post('/venues', data),
     update: (id, data) => axiosClient.put(`/venues/${id}`, data),
     delete: (id) => axiosClient.delete(`/venues/${id}`),
};
