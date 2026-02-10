import http from 'http';
import app from './app.js';
import config from './config/env.js';
import connectDB from './config/db.js';
import { setupSockets } from './sockets/index.js';

const server = http.createServer(app);

// Setup Socket.io
setupSockets(server);

const start = async () => {
     await connectDB();
     server.listen(config.port, () => {
          console.log(`🚀 Server running on port ${config.port}`);
          console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
     });
};

start();
