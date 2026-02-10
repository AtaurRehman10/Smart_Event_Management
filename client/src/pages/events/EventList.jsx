import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import { useAuth } from '../../hooks/useAuth';

const filterOptions = [
     { value: 'all', label: 'All' },
     { value: 'Published', label: 'Published' },
     { value: 'Draft', label: 'Draft' },
     { value: 'Cancelled', label: 'Cancelled' },
];

export default function EventList() {
     const [events, setEvents] = useState([]);
     const [loading, setLoading] = useState(true);
     const [filter, setFilter] = useState('all');
     const { user } = useAuth();

     useEffect(() => {
          eventApi.getAll({ status: filter === 'all' ? undefined : filter })
               .then(res => setEvents(res.data.events || []))
               .catch(console.error)
               .finally(() => setLoading(false));
     }, [filter]);

     if (loading) return (
          <div className="p-6 space-y-6">
               <div className="skeleton h-10 w-64" />
               <div className="flex gap-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-9 w-24 rounded-full" />)}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-56 rounded-[var(--border-radius)]" />)}
               </div>
          </div>
     );

     return (
          <div className="p-6 space-y-6 animate-fade-in">
               {/* Header */}
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-2xl font-bold text-[var(--text-primary)]">Events</h1>
                         <p className="text-sm text-[var(--text-muted)] mt-1">Discover and manage all your events</p>
                    </div>
                    {(user?.role === 'Organizer' || user?.role === 'SuperAdmin') && (
                         <Link to="/events/create" className="btn btn-primary">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Create Event
                         </Link>
                    )}
               </div>

               {/* Filter Pills */}
               <div className="flex gap-2 flex-wrap">
                    {filterOptions.map(f => (
                         <button
                              key={f.value}
                              onClick={() => setFilter(f.value)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === f.value
                                   ? 'bg-[var(--color-primary)] text-white shadow-[0_2px_12px_rgba(99,102,241,0.3)]'
                                   : 'bg-[var(--bg-elevated)]/60 text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] hover:text-[var(--text-primary)]'
                                   }`}
                         >
                              {f.label}
                         </button>
                    ))}
               </div>

               {/* Event Grid */}
               {events.length === 0 ? (
                    <div className="glass-card-static p-12 text-center">
                         <div className="text-4xl mb-3 animate-float">🎪</div>
                         <p className="text-[var(--text-secondary)] font-medium">No events found</p>
                         <p className="text-sm text-[var(--text-muted)] mt-1">
                              {filter !== 'all' ? 'Try changing your filter' : 'Create your first event to get started'}
                         </p>
                    </div>
               ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                         {events.map((event, idx) => (
                              <Link
                                   key={event._id}
                                   to={`/events/${event._id}`}
                                   className="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                                   style={{ animationDelay: `${idx * 0.05}s` }}
                              >
                                   {/* Card Top Gradient */}
                                   <div className="h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />

                                   <div className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                             <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--color-primary-light)] transition-colors">
                                                  {event.title}
                                             </h3>
                                             <span className={`badge text-[10px] ml-2 flex-shrink-0 ${event.status === 'Published' ? 'badge-success' : event.status === 'Draft' ? 'badge-warning' : 'badge-danger'}`}>
                                                  {event.status}
                                             </span>
                                        </div>

                                        <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">{event.description}</p>

                                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                                             <span className="flex items-center gap-1">
                                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                  </svg>
                                                  {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                             </span>
                                             {event.venue?.name && (
                                                  <span className="flex items-center gap-1">
                                                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                       </svg>
                                                       {event.venue.name}
                                                  </span>
                                             )}
                                             {event.category && (
                                                  <span className="badge badge-primary text-[10px]">{event.category}</span>
                                             )}
                                        </div>
                                   </div>
                              </Link>
                         ))}
                    </div>
               )}
          </div>
     );
}
