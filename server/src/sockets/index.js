import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export function setupSockets(server) {
     const io = new Server(server, {
          cors: {
               origin: config.clientUrl,
               methods: ['GET', 'POST'],
          },
     });

     // Auth middleware for sockets
     io.use((socket, next) => {
          try {
               const token = socket.handshake.auth.token;
               if (!token) return next(new Error('Authentication required'));
               const decoded = jwt.verify(token, config.jwtSecret);
               socket.userId = decoded.id;
               next();
          } catch (error) {
               next(new Error('Invalid token'));
          }
     });

     io.on('connection', (socket) => {
          console.log(`🔌 User connected: ${socket.userId}`);

          // Join event room
          socket.on('join:event', (eventId) => {
               socket.join(`event:${eventId}`);
               console.log(`User ${socket.userId} joined event: ${eventId}`);
          });

          // Join session room
          socket.on('join:session', (sessionId) => {
               socket.join(`session:${sessionId}`);
          });

          // Session capacity update
          socket.on('session:capacityUpdate', (data) => {
               io.to(`event:${data.eventId}`).emit('session:updated', data);
          });

          // Live poll vote
          socket.on('poll:vote', (data) => {
               io.to(`session:${data.sessionId}`).emit('poll:updated', data);
          });

          // Q&A
          socket.on('question:new', (data) => {
               io.to(`session:${data.sessionId}`).emit('question:added', data);
          });

          socket.on('question:upvote', (data) => {
               io.to(`session:${data.sessionId}`).emit('question:updated', data);
          });

          // Disconnect
          socket.on('disconnect', () => {
               console.log(`🔌 User disconnected: ${socket.userId}`);
          });
     });

     return io;
}
