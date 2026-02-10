import { Router } from 'express';
import stripe from '../config/stripe.js';
import config from '../config/env.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/stripe/config — publishable key for client
router.get('/config', (req, res) => {
     res.json({ publishableKey: config.stripePublishableKey });
});

// POST /api/stripe/create-payment-intent
router.post('/create-payment-intent', auth, async (req, res, next) => {
     try {
          const { amount, currency = 'usd', metadata = {} } = req.body;

          const paymentIntent = await stripe.paymentIntents.create({
               amount: Math.round(amount * 100), // Stripe needs cents
               currency,
               metadata: {
                    userId: req.user._id.toString(),
                    ...metadata,
               },
          });

          res.json({
               success: true,
               clientSecret: paymentIntent.client_secret,
               paymentIntentId: paymentIntent.id,
          });
     } catch (error) {
          next(error);
     }
});

// POST /api/stripe/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
     const sig = req.headers['stripe-signature'];

     try {
          const event = stripe.webhooks.constructEvent(req.body, sig, config.stripeWebhookSecret);

          if (event.type === 'payment_intent.succeeded') {
               const paymentIntent = event.data.object;
               console.log('✅ Payment succeeded:', paymentIntent.id);
               // Update registration status
          }

          res.json({ received: true });
     } catch (error) {
          console.error('Webhook error:', error.message);
          res.status(400).send(`Webhook Error: ${error.message}`);
     }
});

export default router;

// Need to import express for the raw body parser in webhook
import express from 'express';
