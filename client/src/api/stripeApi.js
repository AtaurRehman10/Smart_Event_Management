import axiosClient from './axiosClient';

export const stripeApi = {
     createPaymentIntent: (data) => axiosClient.post('/stripe/create-payment-intent', data),
     getPublishableKey: () => axiosClient.get('/stripe/config'),
};
