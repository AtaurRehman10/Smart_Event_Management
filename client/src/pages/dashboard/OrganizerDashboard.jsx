import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
     Chart as ChartJS,
     CategoryScale,
     LinearScale,
     PointElement,
     LineElement,
     BarElement,
     ArcElement,
     Title,
     Tooltip,
     Legend,
     Filler
} from 'chart.js';
import {
     Plus,
     Calendar,
     Users,
     DollarSign,
     TrendingUp,
     ClipboardList,
     Search,
     IdCard,
     Network,
     BarChart3,
     PieChart,
     ChevronRight,
     MapPin,
     LayoutGrid
} from 'lucide-react';
import { eventApi } from '../../api/eventApi';
import { useAuth } from '../../hooks/useAuth';

ChartJS.register(
     CategoryScale, LinearScale, PointElement, LineElement,
     BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

function StatCard({ icon: Icon, label, value, color, delay }) {
     const colorMap = {
          indigo: 'bg-indigo-500/10 text-indigo-400',
          cyan: 'bg-cyan-500/10 text-cyan-400',
          emerald: 'bg-emerald-500/10 text-emerald-400',
          amber: 'bg-amber-500/10 text-amber-400',
     };

     return (
          <div
               className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
               style={{ animationDelay: delay }}
          >
               <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
                         <Icon size={22} />
                    </div>
                    <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
                         <p className="text-2xl font-black text-white mt-0.5">{value}</p>
                    </div>
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
          maintainAspectRatio: false,
          plugins: {
               legend: {
                    display: false
               },
               tooltip: {
                    backgroundColor: '#0f172a',
                    titleFont: { size: 12, family: 'Inter' },
                    bodyFont: { size: 12, family: 'Inter' },
                    padding: 12,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
               }
          },
          scales: {
               x: {
                    ticks: { color: '#64748b', font: { size: 10 } },
                    grid: { display: false }
               },
               y: {
                    ticks: { color: '#64748b', font: { size: 10 } },
                    grid: { color: 'rgba(255,255,255,0.05)' }
               },
          },
     };

     if (loading) return <DashboardSkeleton />;

     return (
          <div className="min-h-screen bg-[#020617] text-slate-50 p-6 md:p-10 space-y-10 selection:bg-indigo-500/30">
               {/* Ambient Background */}
               <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
                    <div className="absolute top-[20%] -right-[5%] h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px]" />
               </div>

               {/* Header Section */}
               <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                         <div className="flex items-center gap-2 text-indigo-400 mb-2">
                              <LayoutGrid size={16} />
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Management Portal</span>
                         </div>
                         <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                              Welcome, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>
                         </h1>
                    </div>
                    <Link to="/events/create" className="inline-flex h-12 items-center gap-2 rounded-full bg-indigo-600 px-6 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.3)]">
                         <Plus size={18} />
                         Create New Event
                    </Link>
               </div>

               {/* Stats Grid */}
               <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Calendar} label="Total Events" value={events.length} color="indigo" delay="0s" />
                    <StatCard icon={Users} label="Total Attendees" value={totalAttendees.toLocaleString()} color="cyan" delay="0.1s" />
                    <StatCard icon={DollarSign} label="Gross Revenue" value={`$${totalRevenue.toLocaleString()}`} color="emerald" delay="0.2s" />
                    <StatCard icon={TrendingUp} label="Live Events" value={events.filter(e => e.status === 'Published').length} color="amber" delay="0.3s" />
               </div>

               {/* Quick Actions */}
               <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <QuickLink to="/events" label="Event List" icon={ClipboardList} color="indigo" />
                    <QuickLink to="/search" label="Global Search" icon={Search} color="cyan" />
                    <QuickLink to="/badges" label="Badge Designer" icon={IdCard} color="amber" />
                    <QuickLink to="/networking" label="Networking" icon={Network} color="emerald" />
               </div>

               {/* Charts Section */}
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 rounded-3xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-sm">
                         <div className="flex items-center justify-between mb-8">
                              <h3 className="text-lg font-bold flex items-center gap-2">
                                   <BarChart3 size={18} className="text-indigo-400" />
                                   Registration Trends
                              </h3>
                         </div>
                         <div className="h-[300px]">
                              <Line data={REGISTRATION_DATA} options={chartOptions} />
                         </div>
                    </div>

                    <div className="lg:col-span-4 rounded-3xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-sm">
                         <h3 className="text-lg font-bold flex items-center gap-2 mb-8">
                              <PieChart size={18} className="text-purple-400" />
                              Event Distribution
                         </h3>
                         <div className="h-[300px] flex items-center justify-center">
                              <Doughnut data={EVENT_TYPE_DATA} options={{
                                   responsive: true,
                                   maintainAspectRatio: false,
                                   plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10, weight: '600' }, padding: 20 } } }
                              }} />
                         </div>
                    </div>
               </div>

               {/* Recent Events List */}
               {events.length > 0 && (
                    <div className="relative z-10 space-y-6">
                         <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold flex items-center gap-2">
                                   <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                   Recent Deployments
                              </h3>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {events.slice(0, 6).map((event) => (
                                   <EventCard key={event._id} event={event} />
                              ))}
                         </div>
                    </div>
               )}
          </div>
     );
}

/* Helper Components */

function QuickLink({ to, label, icon: Icon, color }) {
     const variants = {
          indigo: 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white',
          cyan: 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white',
          emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
          amber: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-600 group-hover:text-white',
     };

     return (
          <Link to={to} className="group relative rounded-2xl border border-white/5 bg-slate-900/40 p-5 text-center transition-all hover:bg-slate-900/80 hover:border-white/10">
               <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${variants[color]}`}>
                    <Icon size={22} />
               </div>
               <span className="text-xs font-bold text-slate-400 tracking-wide group-hover:text-white transition-colors uppercase">{label}</span>
          </Link>
     );
}

function EventCard({ event }) {
     const statusColors = {
          Published: 'bg-emerald-500/10 text-emerald-400',
          Draft: 'bg-amber-500/10 text-amber-400',
          Archived: 'bg-slate-500/10 text-slate-400'
     };

     return (
          <Link to={`/events/${event._id}`} className="group relative rounded-2xl border border-white/5 bg-slate-900/40 p-6 transition-all hover:border-indigo-500/30 hover:bg-slate-900/80">
               <div className="flex items-start justify-between mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[event.status] || statusColors.Archived}`}>
                         {event.status}
                    </span>
                    <ChevronRight size={16} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
               </div>

               <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                    {event.title}
               </h4>
               <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6">
                    {event.description}
               </p>

               <div className="flex items-center gap-4 border-t border-white/5 pt-4 text-[11px] font-medium text-slate-400">
                    <div className="flex items-center gap-1.5">
                         <CalendarDays size={14} className="text-slate-600" />
                         {new Date(event.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                         <Users size={14} className="text-slate-600" />
                         {event.attendeeCount || 0}
                    </div>
               </div>
          </Link>
     );
}

function DashboardSkeleton() {
     return (
          <div className="min-h-screen bg-[#020617] p-10 space-y-10 animate-pulse">
               <div className="flex justify-between items-center"><div className="h-10 w-64 bg-slate-900 rounded-lg" /><div className="h-12 w-48 bg-slate-900 rounded-full" /></div>
               <div className="grid grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-900 rounded-2xl" />)}</div>
               <div className="grid grid-cols-12 gap-8"><div className="col-span-8 h-96 bg-slate-900 rounded-3xl" /><div className="col-span-4 h-96 bg-slate-900 rounded-3xl" /></div>
          </div>
     );
}

/* Constants for refactored data visualization */
const REGISTRATION_DATA = {
     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
     datasets: [{
          data: [120, 190, 170, 240, 310, 280],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.08)',
          tension: 0.4, fill: true, pointRadius: 4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#020617',
          pointBorderWidth: 2,
     }],
};

const EVENT_TYPE_DATA = {
     labels: ['Conferences', 'Workshops', 'Meetups', 'Webinars'],
     datasets: [{
          data: [40, 25, 20, 15],
          backgroundColor: ['#6366f1', '#06b6d4', '#f59e0b', '#10b981'],
          borderWidth: 0,
          hoverOffset: 10,
     }],
};