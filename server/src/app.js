import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import pollRoutes from './routes/pollRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';

const app = express();

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
     res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/stripe', stripeRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
