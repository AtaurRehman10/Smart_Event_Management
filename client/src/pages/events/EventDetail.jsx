import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import { useAuth } from '../../hooks/useAuth';

export default function EventDetail() {
     const { id } = useParams();
     const { user } = useAuth();
     const [event, setEvent] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          eventApi.getById(id)
               .then(res => setEvent(res.data.event))
               .catch(console.error)
               .finally(() => setLoading(false));
     }, [id]);

     if (loading) return (
          <div className="p-6 space-y-6">
               <div className="skeleton h-52 rounded-[var(--border-radius)]" />
               <div className="skeleton h-6 w-64" />
               <div className="skeleton h-4 w-96" />
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-[var(--border-radius)]" />)}
               </div>
          </div>
     );

     if (!event) return (
          <div className="p-6 text-center">
               <div className="glass-card-static p-12 max-w-md mx-auto">
                    <div className="text-4xl mb-3">😕</div>
                    <p className="text-[var(--text-secondary)] font-medium">Event not found</p>
                    <Link to="/events" className="btn btn-primary mt-4 inline-flex">← Back to Events</Link>
               </div>
          </div>
     );

     return (
          <div className="p-6 space-y-6 animate-fade-in">
               {/* Hero Banner */}
               <div className="gradient-border-card overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/5" />
                    <div className="orb orb-primary w-[300px] h-[300px] top-[-50%] right-[-10%] opacity-[0.08]" />
                    <div className="relative z-10 p-8">
                         <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                   <span className={`badge mb-3 ${event.status === 'Published' ? 'badge-success' : event.status === 'Draft' ? 'badge-warning' : 'badge-danger'}`}>
                                        {event.status}
                                   </span>
                                   <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{event.title}</h1>
                                   <p className="text-[var(--text-secondary)] max-w-2xl">{event.description}</p>
                              </div>
                         </div>

                         {/* Info Row */}
                         <div className="flex flex-wrap gap-4 mt-6 text-sm">
                              {event.startDate && (
                                   <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                        <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                   </div>
                              )}
                              {event.location?.city && (
                                   <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                        <svg className="w-4 h-4 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {event.location.name || event.location.city}
                                   </div>
                              )}
                              {event.category && (
                                   <span className="badge badge-primary">{event.category}</span>
                              )}
                         </div>
                    </div>
               </div>

               {/* Stats Row */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                         { icon: '👥', label: 'Max Attendees', value: event.maxAttendees || '∞' },
                         { icon: '🎫', label: 'Ticket Types', value: event.ticketTypes?.length || 0 },
                         { icon: '📊', label: 'Registered', value: event.attendeeCount || 0 },
                         { icon: '🕐', label: 'Duration', value: event.startDate && event.endDate ? `${Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24))}d` : '—' },
                    ].map((s, i) => (
                         <div key={i} className="glass-card p-4 text-center animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                              <span className="text-xl">{s.icon}</span>
                              <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{s.value}</p>
                              <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
                         </div>
                    ))}
               </div>

               {/* Action Buttons */}
               <div className="flex flex-wrap gap-3">
                    <Link to={`/events/${id}/register`} className="btn btn-primary">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                         </svg>
                         Register Now
                    </Link>
                    <Link to={`/events/${id}/sessions`} className="btn btn-secondary">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                         Schedule
                    </Link>
                    {event.venue && (
                         <Link to={`/events/${id}/venue`} className="btn btn-secondary">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                              Venue Map
                         </Link>
                    )}
                    {(user?.role === 'Organizer' || user?.role === 'SuperAdmin') && (
                         <Link to={`/events/${id}/edit`} className="btn btn-secondary">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                         </Link>
                    )}
               </div>

               {/* Tags */}
               {event.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                         {event.tags.map(tag => (
                              <span key={tag} className="badge badge-primary text-xs">{tag}</span>
                         ))}
                    </div>
               )}
          </div>
     );
}
