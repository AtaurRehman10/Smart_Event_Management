import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
     {
          label: 'Dashboard',
          path: '/',
          icon: (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
               </svg>
          ),
          roles: ['SuperAdmin', 'Organizer', 'Staff'],
     },
     {
          label: 'My Agenda',
          path: '/dashboard/attendee',
          icon: (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
          ),
          roles: ['Attendee'],
     },
     {
          label: 'Events',
          path: '/events',
          icon: (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
          ),
     },
     {
          label: 'Search',
          path: '/search',
          icon: (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
          ),
     },
     {
          label: 'Networking',
          path: '/networking',
          icon: (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
          ),
     },
     {
          label: 'Badges',
          path: '/badges',
          icon: (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
               </svg>
          ),
          roles: ['Organizer', 'SuperAdmin'],
     },
];

export default function Sidebar() {
     const [collapsed, setCollapsed] = useState(false);
     const location = useLocation();
     const { user } = useAuth();

     const filteredItems = navItems.filter(
          (item) => !item.roles || item.roles.includes(user?.role)
     );

     return (
          <aside
               className={`sticky top-0 h-screen flex flex-col border-r border-[var(--border-color)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}
               role="navigation"
               aria-label="Main navigation"
          >
               {/* Logo */}
               <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border-color)]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center flex-shrink-0 shadow-lg">
                         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                         </svg>
                    </div>
                    {!collapsed && (
                         <span className="text-lg font-bold gradient-text">EventSphere</span>
                    )}
               </div>

               {/* Nav Links */}
               <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
                    {filteredItems.map((item) => {
                         const isActive = location.pathname === item.path;
                         return (
                              <Link
                                   key={item.path}
                                   to={item.path}
                                   className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]/60 hover:text-[var(--text-primary)]'
                                        }`}
                                   aria-current={isActive ? 'page' : undefined}
                                   title={collapsed ? item.label : undefined}
                              >
                                   {/* Active indicator bar */}
                                   {isActive && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)]" />
                                   )}

                                   <span className={`flex-shrink-0 transition-all duration-200 ${isActive ? 'text-[var(--color-primary)]' : 'group-hover:text-[var(--color-primary-light)]'}`}>
                                        {item.icon}
                                   </span>
                                   {!collapsed && <span>{item.label}</span>}
                                   {isActive && !collapsed && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_6px_var(--color-primary)]" />
                                   )}

                                   {/* Tooltip for collapsed sidebar */}
                                   {collapsed && (
                                        <span className="sidebar-tooltip group-hover:opacity-100">
                                             {item.label}
                                        </span>
                                   )}
                              </Link>
                         );
                    })}
               </nav>

               {/* Collapse Toggle */}
               <div className="p-3 border-t border-[var(--border-color)]">
                    <button
                         onClick={() => setCollapsed(!collapsed)}
                         className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]/60 hover:text-[var(--text-secondary)] transition-all text-sm"
                         aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                         <svg
                              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                         </svg>
                         {!collapsed && <span>Collapse</span>}
                    </button>
               </div>
          </aside>
     );
}
