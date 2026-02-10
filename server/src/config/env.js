import dotenv from 'dotenv';
dotenv.config();

export default {
     port: process.env.PORT || 5000,
     mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/devcon',
     jwtSecret: process.env.JWT_SECRET || 'devcon-hackathon-secret-key-2025',
     jwtExpire: '7d',
     stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
     stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
     stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
     emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
     emailPort: process.env.EMAIL_PORT || 587,
     emailUser: process.env.EMAIL_USER || '',
     emailPass: process.env.EMAIL_PASS || '',
     clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
