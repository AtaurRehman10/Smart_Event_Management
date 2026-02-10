import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../api/axiosClient';

export default function Search() {
     const [query, setQuery] = useState('');
     const [type, setType] = useState('events');
     const [results, setResults] = useState([]);
     const [loading, setLoading] = useState(false);
     const [suggestions, setSuggestions] = useState([]);
     const debouncedQuery = useDebounce(query, 300);

     const doSearch = useCallback(async () => {
          if (!debouncedQuery || debouncedQuery.length < 2) {
               setResults([]); return;
          }
          setLoading(true);
          try {
               const res = await api.get('/api/search', { params: { q: debouncedQuery, type } });
               setResults(res.data.results || []);
          } catch (err) { console.error(err); }
          finally { setLoading(false); }
     }, [debouncedQuery, type]);

     useState(() => { doSearch(); }, [doSearch]);

     const fetchSuggestions = async (val) => {
          setQuery(val);
          if (val.length < 2) { setSuggestions([]); return; }
          try {
               const res = await api.get('/api/search/suggest', { params: { q: val } });
               setSuggestions(res.data.suggestions || []);
          } catch { setSuggestions([]); }
     };

     const highlight = (text) => {
          if (!query) return text;
          const re = new RegExp(`(${query})`, 'gi');
          return text.replace(re, '<mark class="bg-[var(--color-primary)]/30 text-[var(--text-primary)] rounded px-0.5">$1</mark>');
     };

     return (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
               <div className="text-center space-y-4 py-8">
                    <h1 className="text-4xl font-bold text-[var(--text-primary)]">
                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Discover</span> Everything
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-lg mx-auto">
                         Find events, sessions, speakers, and attendees across the platform.
                    </p>
               </div>

               <div className="relative max-w-2xl mx-auto z-50">
                    <div className="relative group">
                         <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                         <input
                              className="relative w-full bg-[var(--bg-elevated)]/80 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl py-5 pl-14 pr-4 text-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] shadow-2xl transition-all"
                              placeholder="Search events, sessions..."
                              value={query}
                              onChange={e => fetchSuggestions(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && doSearch()}
                              autoFocus
                         />
                         <svg className="w-6 h-6 text-[var(--text-muted)] absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                         </svg>
                    </div>

                    {suggestions.length > 0 && (
                         <div className="absolute top-full left-0 right-0 mt-2 glass-card p-2 animate-scale-in">
                              {suggestions.map((s, i) => (
                                   <button
                                        key={i}
                                        onClick={() => { setQuery(s); setSuggestions([]); doSearch(); }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-3 group"
                                   >
                                        <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        {s}
                                   </button>
                              ))}
                         </div>
                    )}
               </div>

               <div className="flex justify-center gap-3">
                    {['events', 'sessions', 'users'].map(t => (
                         <button
                              key={t}
                              onClick={() => setType(t)}
                              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 capitalize flex items-center gap-2 ${type === t
                                   ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-indigo-500/20 scale-105'
                                   : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-secondary)]'
                                   }`}
                         >
                              {t === 'events' && '🗓️'}
                              {t === 'sessions' && '🎤'}
                              {t === 'users' && '👥'}
                              {t}
                         </button>
                    ))}
               </div>

               {loading ? (
                    <div className="space-y-4 max-w-2xl mx-auto">
                         {[...Array(3)].map((_, i) => (
                              <div key={i} className="flex gap-4 p-4 rounded-xl glass-card">
                                   <div className="skeleton w-16 h-16 rounded-lg flex-shrink-0" />
                                   <div className="flex-1 space-y-2 py-1">
                                        <div className="skeleton h-5 w-3/4 rounded" />
                                        <div className="skeleton h-4 w-full rounded opacity-60" />
                                   </div>
                              </div>
                         ))}
                    </div>
               ) : results.length === 0 ? (
                    query && (
                         <div className="text-center py-20 animate-fade-in">
                              <div className="w-20 h-20 bg-[var(--bg-elevated)] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                   🤷‍♂️
                              </div>
                              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No results found</h3>
                              <p className="text-[var(--text-muted)]">Try adjusting your search terms or filters</p>
                         </div>
                    )
               ) : (
                    <div className="space-y-4 max-w-2xl mx-auto">
                         <div className="text-sm font-medium text-[var(--text-muted)] mb-2 px-2">
                              Found {results.length} results
                         </div>
                         {results.map((r, i) => (
                              <Link
                                   key={i}
                                   to={type === 'events' ? `/events/${r._id}` : '#'}
                                   className="group block p-5 rounded-2xl glass-card border border-[var(--border-color)] hover:border-[var(--color-primary)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.1)] transition-all animate-slide-up relative overflow-hidden"
                                   style={{ animationDelay: `${i * 0.05}s` }}
                              >
                                   <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                        <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                   </div>
                                   <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--color-primary-light)] transition-colors" dangerouslySetInnerHTML={{ __html: highlight(r.title || r.name || '') }} />
                                   {r.description && <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: highlight(r.description) }} />}
                                   <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                        {r.date && (
                                             <span className="flex items-center gap-1">
                                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                  {new Date(r.date).toLocaleDateString()}
                                             </span>
                                        )}
                                        {r.location && (
                                             <span className="flex items-center gap-1">
                                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                  {r.location}
                                             </span>
                                        )}
                                   </div>
                              </Link>
                         ))}
                    </div>
               )}
          </div>
     );
}
