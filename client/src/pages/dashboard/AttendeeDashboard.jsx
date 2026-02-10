import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationApi } from '../../api/registrationApi';
import { useAuth } from '../../hooks/useAuth';

export default function AttendeeDashboard() {
     const { user } = useAuth();
     const [registrations, setRegistrations] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          registrationApi.getMyRegistrations()
               .then(res => setRegistrations(res.data.registrations || []))
               .catch(console.error)
               .finally(() => setLoading(false));
     }, []);

     const upcomingEvents = registrations.filter(
          r => new Date(r.event?.startDate) > new Date()
     );

     if (loading) return (
          <div className="p-6 space-y-6">
               <div className="skeleton h-32 rounded-[var(--border-radius)]" />
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-[var(--border-radius)]" />)}
               </div>
               <div className="skeleton h-64 rounded-[var(--border-radius)]" />
          </div>
     );

     return (
          <div className="p-6 space-y-6 animate-fade-in">
               {/* Welcome Banner */}
               <div className="gradient-border-card p-6 relative overflow-hidden animate-slide-up">
                    <div className="orb orb-primary w-[200px] h-[200px] top-[-50%] right-[-10%] opacity-[0.06]" />
                    <div className="relative z-10">
                         <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                         </h1>
                         <p className="text-sm text-[var(--text-muted)] mt-1">
                              You have <span className="font-semibold text-[var(--color-primary-light)]">{upcomingEvents.length}</span> upcoming event{upcomingEvents.length !== 1 ? 's' : ''}
                         </p>
                    </div>
               </div>

               {/* Quick Actions */}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {[
                         { to: '/events', label: 'Browse Events', icon: '🎪', color: '#6366f1' },
                         { to: '/search', label: 'Search', icon: '🔍', color: '#06b6d4' },
                         { to: '/networking', label: 'Network', icon: '🤝', color: '#10b981' },
                         { to: '/search', label: 'Discover', icon: '✨', color: '#f59e0b' },
                    ].map(action => (
                         <Link
                              key={action.label}
                              to={action.to}
                              className="glass-card p-4 flex flex-col items-center gap-2 text-center hover:scale-[1.03] transition-transform group"
                         >
                              <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${action.color}18, ${action.color}30)` }}>
                                   <span className="text-xl">{action.icon}</span>
                              </div>
                              <span className="text-xs font-medium text-[var(--text-secondary)]">{action.label}</span>
                         </Link>
                    ))}
               </div>

               {/* Upcoming Events */}
               <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    <div className="flex items-center justify-between mb-4">
                         <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                              Upcoming Events
                         </h2>
                         <Link to="/events" className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors font-medium">
                              See all →
                         </Link>
                    </div>

                    {upcomingEvents.length === 0 ? (
                         <div className="glass-card-static p-10 text-center">
                              <div className="text-4xl mb-3 animate-float">🎫</div>
                              <p className="text-[var(--text-secondary)] font-medium">No upcoming events yet</p>
                              <p className="text-[var(--text-muted)] text-sm mt-1 mb-4">Browse and register for exciting events</p>
                              <Link to="/events" className="btn btn-primary">
                                   Browse Events
                              </Link>
                         </div>
                    ) : (
                         <div className="space-y-3">
                              {upcomingEvents.slice(0, 5).map((reg, idx) => (
                                   <Link
                                        key={reg._id}
                                        to={`/events/${reg.event?._id}`}
                                        className="glass-card p-4 flex items-center gap-4 group hover:scale-[1.01] transition-all animate-slide-up"
                                        style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
                                   >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/10 flex flex-col items-center justify-center text-center flex-shrink-0">
                                             <span className="text-[10px] font-bold text-[var(--color-primary-light)] uppercase">
                                                  {new Date(reg.event?.startDate).toLocaleDateString('en-US', { month: 'short' })}
                                             </span>
                                             <span className="text-sm font-bold text-[var(--text-primary)]">
                                                  {new Date(reg.event?.startDate).getDate()}
                                             </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                             <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--color-primary-light)] transition-colors">{reg.event?.title}</h4>
                                             <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                                  {reg.event?.venue?.name || 'Virtual'} • {reg.ticketType || 'General'}
                                             </p>
                                        </div>
                                        <span className={`badge text-[10px] ${reg.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}`}>
                                             {reg.status}
                                        </span>
                                   </Link>
                              ))}
                         </div>
                    )}
               </div>

               {/* All Registrations */}
               {registrations.length > upcomingEvents.length && (
                    <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
                         <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                              <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
                              Past Events
                         </h2>
                         <div className="space-y-2">
                              {registrations.filter(r => new Date(r.event?.startDate) <= new Date()).slice(0, 3).map(reg => (
                                   <Link
                                        key={reg._id}
                                        to={`/events/${reg.event?._id}`}
                                        className="glass-card p-4 flex items-center gap-4 opacity-70 hover:opacity-100 transition-all"
                                   >
                                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] flex flex-col items-center justify-center flex-shrink-0">
                                             <span className="text-[9px] text-[var(--text-muted)] uppercase">
                                                  {new Date(reg.event?.startDate).toLocaleDateString('en-US', { month: 'short' })}
                                             </span>
                                             <span className="text-xs font-bold text-[var(--text-secondary)]">
                                                  {new Date(reg.event?.startDate).getDate()}
                                             </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                             <h4 className="text-sm font-medium text-[var(--text-secondary)] truncate">{reg.event?.title}</h4>
                                        </div>
                                   </Link>
                              ))}
                         </div>
                    </div>
               )}
          </div>
     );
}
