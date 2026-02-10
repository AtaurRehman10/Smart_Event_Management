import axiosClient from './axiosClient';

export const registrationApi = {
     register: (data) => axiosClient.post('/registrations', data),
     getByEvent: (eventId, params) => axiosClient.get(`/registrations/event/${eventId}`, { params }),
     getMyRegistrations: () => axiosClient.get('/registrations/me'),
     cancel: (id) => axiosClient.patch(`/registrations/${id}/cancel`),
     checkin: (id) => axiosClient.post(`/registrations/${id}/checkin`),
     exportCSV: (eventId) => axiosClient.get(`/registrations/event/${eventId}/export`, { responseType: 'blob' }),
};
