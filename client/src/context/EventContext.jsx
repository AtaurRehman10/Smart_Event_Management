import { createContext, useState, useCallback } from 'react';
import { eventApi } from '../api/eventApi';

export const EventContext = createContext(null);

export function EventProvider({ children }) {
     const [events, setEvents] = useState([]);
     const [currentEvent, setCurrentEvent] = useState(null);
     const [loading, setLoading] = useState(false);

     const fetchEvents = useCallback(async (params) => {
          setLoading(true);
          try {
               const res = await eventApi.getAll(params);
               setEvents(res.data.events);
          } finally {
               setLoading(false);
          }
     }, []);

     const fetchEvent = useCallback(async (id) => {
          setLoading(true);
          try {
               const res = await eventApi.getById(id);
               setCurrentEvent(res.data.event);
               return res.data.event;
          } finally {
               setLoading(false);
          }
     }, []);

     const createEvent = async (data) => {
          const res = await eventApi.create(data);
          setEvents(prev => [res.data.event, ...prev]);
          return res.data.event;
     };

     const updateEvent = async (id, data) => {
          const res = await eventApi.update(id, data);
          setEvents(prev => prev.map(e => e._id === id ? res.data.event : e));
          if (currentEvent?._id === id) setCurrentEvent(res.data.event);
          return res.data.event;
     };

     const deleteEvent = async (id) => {
          await eventApi.delete(id);
          setEvents(prev => prev.filter(e => e._id !== id));
          if (currentEvent?._id === id) setCurrentEvent(null);
     };

     return (
          <EventContext.Provider value={{
               events, currentEvent, loading,
               fetchEvents, fetchEvent, createEvent, updateEvent, deleteEvent, setCurrentEvent
          }}>
               {children}
          </EventContext.Provider>
     );
}
