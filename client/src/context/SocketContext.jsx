import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext(null);

export const useSocket = () => {
     return useContext(SocketContext);
};

export function SocketProvider({ children }) {
     const [socket, setSocket] = useState(null);
     const [connected, setConnected] = useState(false);
     const { user } = useAuth();

     useEffect(() => {
          if (!user) return;

          const newSocket = io('/', {
               auth: { token: localStorage.getItem('token') },
               transports: ['websocket', 'polling'],
          });

          newSocket.on('connect', () => setConnected(true));
          newSocket.on('disconnect', () => setConnected(false));

          setSocket(newSocket);

          return () => {
               newSocket.close();
               setSocket(null);
               setConnected(false);
          };
     }, [user]);

     return (
          <SocketContext.Provider value={{ socket, connected }}>
               {children}
          </SocketContext.Provider>
     );
}
