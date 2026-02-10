import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
     Calendar,
     Search,
     Users,
     Zap,
     ChevronRight,
     Ticket,
     MapPin,
     CalendarDays,
     History,
     LayoutDashboard
} from 'lucide-react';
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

     const pastEvents = registrations.filter(
          r => new Date(r.event?.startDate) <= new Date()
     );

     if (loading) return <DashboardSkeleton />;

     return (
          <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
               {/* Ambient Background */}
               <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
               </div>

               {/* Welcome Banner */}
               <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-6 md:p-10 backdrop-blur-md">
                    <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-4 text-indigo-400">
                              <LayoutDashboard size={20} />
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Attendee Overview</span>
                         </div>
                         <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                              Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>
                         </h1>
                         <p className="mt-2 text-slate-400 max-w-xl">
                              You are currently registered for <span className="text-white font-semibold">{upcomingEvents.length} upcoming experiences</span>.
                              Explore your tickets or discover new sessions below.
                         </p>
                    </div>
               </div>

               {/* Quick Actions Grid */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickAction to="/events" label="Browse Events" icon={Calendar} color="indigo" />
                    <QuickAction to="/search" label="Global Search" icon={Search} color="cyan" />
                    <QuickAction to="/networking" label="Networking" icon={Users} color="emerald" />
                    <QuickAction to="/discover" label="Discover" icon={Zap} color="amber" />
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Main Content: Upcoming Events */}
                    <div className="xl:col-span-8 space-y-6">
                         <div className="flex items-center justify-between">
                              <h2 className="text-lg font-bold flex items-center gap-2">
                                   <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                   Upcoming Schedule
                              </h2>
                              <Link to="/events" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider flex items-center gap-1">
                                   View All Events <ChevronRight size={14} />
                              </Link>
                         </div>

                         {upcomingEvents.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/20 p-12 text-center">
                                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-500 mb-4">
                                        <Ticket size={32} />
                                   </div>
                                   <h3 className="text-lg font-semibold text-white">No active registrations</h3>
                                   <p className="text-slate-500 text-sm mt-1 mb-6">Start your journey by exploring upcoming events in your area.</p>
                                   <Link to="/events" className="inline-flex h-11 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-slate-950 transition-all hover:bg-slate-200">
                                        Find Events
                                   </Link>
                              </div>
                         ) : (
                              <div className="space-y-4">
                                   {upcomingEvents.slice(0, 5).map((reg) => (
                                        <EventListItem key={reg._id} registration={reg} isPast={false} />
                                   ))}
                              </div>
                         )}
                    </div>

                    {/* Sidebar: History */}
                    <div className="xl:col-span-4 space-y-6">
                         <h2 className="text-lg font-bold flex items-center gap-2">
                              <History size={18} className="text-slate-500" />
                              Past Experiences
                         </h2>
                         {pastEvents.length === 0 ? (
                              <p className="text-sm text-slate-500 italic px-2">Your event history will appear here.</p>
                         ) : (
                              <div className="space-y-3">
                                   {pastEvents.slice(0, 4).map((reg) => (
                                        <EventListItem key={reg._id} registration={reg} isPast={true} />
                                   ))}
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}

/* Helper Components */

function QuickAction({ to, label, icon: Icon, color }) {
     const colors = {
          indigo: 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white',
          cyan: 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white',
          emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
          amber: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-600 group-hover:text-white',
     };

     return (
          <Link to={to} className="group relative rounded-2xl border border-white/5 bg-slate-900/40 p-5 transition-all hover:border-white/10 hover:bg-slate-900/60 backdrop-blur-sm text-center">
               <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${colors[color]}`}>
                    <Icon size={22} />
               </div>
               <span className="text-xs font-bold text-slate-400 tracking-wide group-hover:text-white transition-colors">{label}</span>
          </Link>
     );
}

function EventListItem({ registration, isPast }) {
     const date = new Date(registration.event?.startDate);
     return (
          <Link
               to={`/events/${registration.event?._id}`}
               className={`group flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-900/40 p-4 transition-all hover:border-indigo-500/30 hover:bg-slate-900/80 ${isPast ? 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0' : ''}`}
          >
               <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-slate-950 border border-white/5 text-center shrink-0 group-hover:border-indigo-500/20 transition-colors">
                    <span className="text-[10px] font-black uppercase text-indigo-400">
                         {date.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold text-white leading-none mt-0.5">
                         {date.getDate()}
                    </span>
               </div>

               <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                         {registration.event?.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5">
                         <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <MapPin size={12} />
                              <span className="truncate">{registration.event?.venue?.name || 'Virtual'}</span>
                         </div>
                         <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Ticket size={12} />
                              <span>{registration.ticketType || 'Standard'}</span>
                         </div>
                    </div>
               </div>

               <div className={`hidden sm:flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${registration.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                    {registration.status}
               </div>
               <ChevronRight size={16} className="text-slate-700 group-hover:text-indigo-400 transition-colors ml-2" />
          </Link>
     );
}

function DashboardSkeleton() {
     return (
          <div className="p-8 space-y-8 bg-[#020617] min-h-screen">
               <div className="h-48 rounded-3xl bg-slate-900/50 animate-pulse" />
               <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-slate-900/50 animate-pulse" />)}
               </div>
               <div className="h-96 rounded-3xl bg-slate-900/50 animate-pulse" />
          </div>
     );
}