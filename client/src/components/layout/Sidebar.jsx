import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
     LayoutDashboard,
     CalendarDays,
     Calendar,
     Search,
     Users,
     IdCard,
     Zap,
     ChevronLeft
} from 'lucide-react';

const navItems = [
     {
          label: 'Dashboard',
          path: '/',
          icon: LayoutDashboard,
          roles: ['SuperAdmin', 'Organizer', 'Staff'],
     },
     {
          label: 'My Agenda',
          path: '/dashboard/attendee',
          icon: CalendarDays,
          roles: ['Attendee'],
     },
     {
          label: 'Events',
          path: '/events',
          icon: Calendar,
     },
     {
          label: 'Search',
          path: '/search',
          icon: Search,
     },
     {
          label: 'Networking',
          path: '/networking',
          icon: Users,
     },
     {
          label: 'Badges',
          path: '/badges',
          icon: IdCard,
          roles: ['Organizer', 'SuperAdmin'],
     },
];

export default function Sidebar() {
     const [collapsed, setCollapsed] = useState(false);
     const location = useLocation();
     const { user } = useAuth();

     // Filter items based on the user's role from auth context
     const filteredItems = navItems.filter(
          (item) => !item.roles || item.roles.includes(user?.role)
     );

     return (
          <aside
               className={`sticky top-0 h-screen flex flex-col border-r border-white/5 bg-slate-950/60 backdrop-blur-md transition-all duration-300 ease-in-out z-40 ${collapsed ? 'w-[80px]' : 'w-64'}`}
               role="navigation"
               aria-label="Main navigation"
          >
               {/* Branding Section */}
               <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] shrink-0">
                         <Zap size={20} fill="white" className="text-white" />
                    </div>
                    {!collapsed && (
                         <span className="text-xl font-bold tracking-tight text-white animate-in fade-in duration-500">
                              EventSphere
                         </span>
                    )}
               </div>

               {/* Navigation Links */}
               <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {filteredItems.map((item) => {
                         const isActive = location.pathname === item.path;
                         const Icon = item.icon;

                         return (
                              <Link
                                   key={item.path}
                                   to={item.path}
                                   className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-500/10 text-indigo-400'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                   aria-current={isActive ? 'page' : undefined}
                              >
                                   {/* Active indicator bar */}
                                   {isActive && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                   )}

                                   <Icon size={20} className={`shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-300'}`} />

                                   {!collapsed && (
                                        <span className="animate-in fade-in slide-in-from-left-2 duration-300">
                                             {item.label}
                                        </span>
                                   )}

                                   {/* Tooltip for collapsed state */}
                                   {collapsed && (
                                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                                             {item.label}
                                        </div>
                                   )}
                              </Link>
                         );
                    })}
               </nav>

               {/* Collapse Toggle Footer */}
               <div className="p-4 border-t border-white/5 bg-slate-950/40">
                    <button
                         onClick={() => setCollapsed(!collapsed)}
                         className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-all text-xs font-bold uppercase tracking-widest"
                         aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                         <ChevronLeft
                              size={18}
                              className={`transition-transform duration-500 ${collapsed ? 'rotate-180' : ''}`}
                         />
                         {!collapsed && <span>Collapse</span>}
                    </button>
               </div>
          </aside>
     );
}