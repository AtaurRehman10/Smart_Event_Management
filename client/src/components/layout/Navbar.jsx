import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
     Search,
     Bell,
     ChevronDown,
     User as UserIcon,
     LogOut,
     Command,
     Settings,
     LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
     const { user, logout } = useAuth();
     const [showProfile, setShowProfile] = useState(false);

     return (
          <header className=" top-5 z-50 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-md">
               <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">

                    {/* Search Bar / Command Palette Look */}
                    <div className="flex-1 max-w-sm md:max-w-md">
                         <Link
                              to="/search"
                              className="group flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2 text-sm text-slate-400 transition-all hover:border-indigo-500/30 hover:bg-slate-900/80"
                         >
                              <Search size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                              <span className="hidden sm:inline">Search events or attendees...</span>
                              <span className="sm:hidden">Search...</span>

                              <div className="ml-auto hidden items-center gap-1 rounded-md border border-white/10 bg-slate-950 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 md:flex">
                                   <Command size={10} />
                                   <span>K</span>
                              </div>
                         </Link>
                    </div>

                    {/* Right-side Navigation */}
                    <div className="flex items-center gap-2 md:gap-4">

                         {/* Notifications */}
                         <button
                              className="group relative rounded-xl p-2.5 text-slate-400 transition-all hover:bg-white/5 hover:text-white"
                              aria-label="Notifications"
                         >
                              <Bell size={20} />
                              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-slate-950 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                         </button>

                         {/* Divider */}
                         <div className="h-6 w-[1px] bg-white/10" />

                         {/* Profile Dropdown */}
                         <div className="relative">
                              <button
                                   onClick={() => setShowProfile(!showProfile)}
                                   className="flex items-center gap-3 rounded-xl p-1.5 transition-all hover:bg-white/5"
                                   aria-expanded={showProfile}
                              >
                                   <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-lg ring-1 ring-white/10">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                   </div>

                                   <div className="hidden text-left md:block">
                                        <p className="text-xs font-bold text-white tracking-tight">{user?.name}</p>
                                        <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">{user?.role}</p>
                                   </div>

                                   <ChevronDown
                                        size={14}
                                        className={`text-slate-500 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`}
                                   />
                              </button>

                              {/* Dropdown Menu */}
                              {showProfile && (
                                   <>
                                        {/* Overlay to close menu */}
                                        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />

                                        <div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">

                                             <div className="px-3 py-3 border-b border-white/5">
                                                  <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                                                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                                             </div>

                                             <div className="py-1">
                                                  <DropdownLink
                                                       to={user?.role === 'Attendee' ? '/dashboard/attendee' : '/dashboard'}
                                                       icon={LayoutDashboard}
                                                       label="Dashboard"
                                                       onClick={() => setShowProfile(false)}
                                                  />
                                                  <DropdownLink
                                                       to="/profile"
                                                       icon={Settings}
                                                       label="Account Settings"
                                                       onClick={() => setShowProfile(false)}
                                                  />
                                             </div>

                                             <div className="mt-1 border-t border-white/5 pt-1">
                                                  <button
                                                       onClick={() => { logout(); setShowProfile(false); }}
                                                       className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                                                  >
                                                       <LogOut size={16} />
                                                       Sign Out
                                                  </button>
                                             </div>
                                        </div>
                                   </>
                              )}
                         </div>
                    </div>
               </div>
          </header>
     );
}

/* Internal helper for cleaner dropdown items */
function DropdownLink({ to, icon: Icon, label, onClick }) {
     return (
          <Link
               to={to}
               onClick={onClick}
               className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
               <Icon size={16} />
               {label}
          </Link>
     );
}