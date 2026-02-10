import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
     const { user, logout } = useAuth();
     const [showProfile, setShowProfile] = useState(false);

     return (
          <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/70 backdrop-blur-xl">
               {/* Search Bar */}
               <div className="flex-1 max-w-md">
                    <Link
                         to="/search"
                         className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)] text-[var(--text-muted)] text-sm hover:text-[var(--text-secondary)] hover:border-[var(--border-color-hover)] transition-all w-full group"
                         aria-label="Search events, sessions, and attendees"
                    >
                         <svg className="w-4 h-4 group-hover:text-[var(--color-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                         </svg>
                         <span>Search events, sessions, attendees...</span>
                         <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs rounded-md bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-color)]">
                              ⌘K
                         </kbd>
                    </Link>
               </div>

               {/* Right side */}
               <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button
                         className="relative p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/80 transition-all"
                         aria-label="Notifications"
                    >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                         </svg>
                         <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[var(--color-danger)] border-2 border-[var(--bg-secondary)]" />
                    </button>

                    {/* Divider */}
                    <div className="w-px h-8 bg-[var(--border-color)]" />

                    {/* Profile Dropdown */}
                    <div className="relative">
                         <button
                              onClick={() => setShowProfile(!showProfile)}
                              className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[var(--bg-elevated)]/80 transition-all"
                              aria-label="User menu"
                              aria-expanded={showProfile}
                         >
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                   {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <div className="hidden md:block text-left">
                                   <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
                                   <p className="text-xs text-[var(--text-muted)]">{user?.role}</p>
                              </div>
                              <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                         </button>

                         {showProfile && (
                              <>
                                   <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                                   <div className="absolute right-0 top-full mt-2 w-56 py-2 glass-card animate-scale-in z-50" role="menu">
                                        <div className="px-4 py-3 border-b border-[var(--border-color)]">
                                             <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
                                             <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
                                        </div>
                                        <Link
                                             to="/profile"
                                             className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
                                             role="menuitem"
                                             onClick={() => setShowProfile(false)}
                                        >
                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                             </svg>
                                             Profile Settings
                                        </Link>
                                        <hr className="my-1 border-[var(--border-color)]" />
                                        <button
                                             onClick={() => { logout(); setShowProfile(false); }}
                                             className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-[var(--color-danger)] hover:bg-[var(--bg-elevated)] transition-colors"
                                             role="menuitem"
                                        >
                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                             </svg>
                                             Sign Out
                                        </button>
                                   </div>
                              </>
                         )}
                    </div>
               </div>
          </header>
     );
}
