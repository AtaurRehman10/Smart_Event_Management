import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { eventApi } from '../../api/eventApi';
import { useAuth } from '../../hooks/useAuth';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

function StatCard({ icon, label, value, color, delay }) {
     return (
          <div className="glass-card p-5 flex items-center gap-4 animate-slide-up" style={{ animationDelay: delay }}>
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${color}18, ${color}30)` }}>
                    <span className="text-xl">{icon}</span>
               </div>
               <div className="min-w-0">
                    <p className="text-sm text-[var(--text-muted)]">{label}</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
               </div>
          </div>
     );
}

export default function OrganizerDashboard() {
     const { user } = useAuth();
     const [events, setEvents] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          eventApi.getAll()
               .then(res => setEvents(res.data.events || []))
               .catch(console.error)
               .finally(() => setLoading(false));
     }, []);

     const totalAttendees = events.reduce((s, e) => s + (e.attendeeCount || 0), 0);
     const totalRevenue = events.reduce((s, e) => s + (e.revenue || 0), 0);

     const chartOptions = {
          responsive: true,
          plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } } },
          scales: {
               x: { ticks: { color: '#64748b', font: { family: 'Inter' } }, grid: { color: 'rgba(99,102,241,0.06)' } },
               y: { ticks: { color: '#64748b', font: { family: 'Inter' } }, grid: { color: 'rgba(99,102,241,0.06)' } },
          },
     };

     const lineData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
               label: 'Registrations',
               data: [120, 190, 170, 240, 310, 280],
               borderColor: '#6366f1',
               backgroundColor: 'rgba(99,102,241,0.08)',
               tension: 0.4, fill: true, pointRadius: 4,
               pointBackgroundColor: '#6366f1',
               pointBorderColor: '#0a0e1a',
               pointBorderWidth: 2,
          }],
     };

     const doughnutData = {
          labels: ['Conferences', 'Workshops', 'Meetups', 'Webinars'],
          datasets: [{
               data: [40, 25, 20, 15],
               backgroundColor: ['#6366f1', '#06b6d4', '#f59e0b', '#10b981'],
               borderWidth: 0,
               hoverOffset: 6,
          }],
     };

     const barData = {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
               label: 'Check-ins',
               data: [65, 80, 75, 95, 110, 130, 90],
               backgroundColor: 'rgba(99,102,241,0.3)',
               borderColor: '#6366f1',
               borderWidth: 1, borderRadius: 6,
               hoverBackgroundColor: 'rgba(99,102,241,0.5)',
          }],
     };

     if (loading) return (
          <div className="p-6 space-y-6">
               <div className="skeleton h-10 w-64 mb-6" />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-[var(--border-radius)]" />)}
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                    {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 rounded-[var(--border-radius)]" />)}
               </div>
          </div>
     );

     return (
          <div className="p-6 space-y-6 animate-fade-in">
               {/* Welcome Header */}
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
                         </h1>
                         <p className="text-sm text-[var(--text-muted)] mt-1">Here's your event management overview</p>
                    </div>
                    <Link to="/events/create" className="btn btn-primary">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                         </svg>
                         Create Event
                    </Link>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon="🎪" label="Total Events" value={events.length} color="#6366f1" delay="0.05s" />
                    <StatCard icon="👥" label="Total Attendees" value={totalAttendees.toLocaleString()} color="#06b6d4" delay="0.1s" />
                    <StatCard icon="💰" label="Revenue" value={`$${totalRevenue.toLocaleString()}`} color="#10b981" delay="0.15s" />
                    <StatCard icon="📈" label="Active Events" value={events.filter(e => e.status === 'Published').length} color="#f59e0b" delay="0.2s" />
               </div>

               {/* Quick Actions */}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '0.25s' }}>
                    {[
                         { to: '/events', label: 'View Events', icon: '📋', color: '#6366f1' },
                         { to: '/search', label: 'Search', icon: '🔍', color: '#06b6d4' },
                         { to: '/badges', label: 'Badges', icon: '🏷️', color: '#f59e0b' },
                         { to: '/networking', label: 'Network', icon: '🤝', color: '#10b981' },
                    ].map(a => (
                         <Link
                              key={a.to}
                              to={a.to}
                              className="glass-card p-4 flex flex-col items-center gap-2 text-center hover:scale-[1.03] transition-transform"
                         >
                              <span className="text-2xl">{a.icon}</span>
                              <span className="text-xs font-medium text-[var(--text-secondary)]">{a.label}</span>
                         </Link>
                    ))}
               </div>

               {/* Charts */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="gradient-border-card p-5 lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                         <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                              Registration Trends
                         </h3>
                         <Line data={lineData} options={chartOptions} />
                    </div>

                    <div className="gradient-border-card p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                         <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
                              Event Types
                         </h3>
                         <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter' }, padding: 12 } } } }} />
                    </div>
               </div>

               <div className="gradient-border-card p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                         Weekly Check-ins
                    </h3>
                    <Bar data={barData} options={chartOptions} />
               </div>

               {/* Recent Events */}
               {events.length > 0 && (
                    <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
                         <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                              Recent Events
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {events.slice(0, 6).map((event) => (
                                   <Link key={event._id} to={`/events/${event._id}`} className="glass-card p-5 group hover:scale-[1.02] transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                             <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary-light)] transition-colors line-clamp-1">{event.title}</h4>
                                             <span className={`badge badge-${event.status === 'Published' ? 'success' : event.status === 'Draft' ? 'warning' : 'primary'} text-[10px]`}>
                                                  {event.status}
                                             </span>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">{event.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                             <span className="flex items-center gap-1">
                                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                  </svg>
                                                  {new Date(event.startDate).toLocaleDateString()}
                                             </span>
                                             {event.attendeeCount > 0 && (
                                                  <span className="flex items-center gap-1">
                                                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                       </svg>
                                                       {event.attendeeCount}
                                                  </span>
                                             )}
                                        </div>
                                   </Link>
                              ))}
                         </div>
                    </div>
               )}
          </div>
     );
}
