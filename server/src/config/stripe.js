import Stripe from 'stripe';
import config from './env.js';

const stripe = new Stripe(config.stripeSecretKey);

export default stripe;
