import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sessionApi } from '../../api/sessionApi';

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8AM - 7PM
const rooms = ['Main Hall', 'Room A', 'Room B', 'Workshop 1', 'Workshop 2'];

export default function SessionScheduler() {
     const { eventId } = useParams();
     const [sessions, setSessions] = useState([]);
     const [showCreate, setShowCreate] = useState(false);
     const [conflicts, setConflicts] = useState([]);
     const [newSession, setNewSession] = useState({ title: '', room: 'Main Hall', startTime: '', endTime: '', capacity: 50, speakerName: '', color: '#6366f1' });

     useEffect(() => {
          if (eventId) {
               sessionApi.getByEvent(eventId)
                    .then(res => setSessions(res.data.sessions || []))
                    .catch(console.error);
          }
     }, [eventId]);

     const handleCreate = async () => {
          try {
               // Check conflicts
               const conflictRes = await sessionApi.checkConflicts({
                    eventId, startTime: newSession.startTime, endTime: newSession.endTime,
                    room: newSession.room, speakerId: null,
               });

               if (conflictRes.data.hasConflicts) {
                    setConflicts(conflictRes.data.conflicts);
                    return;
               }

               const res = await sessionApi.create({ ...newSession, event: eventId });
               setSessions(prev => [...prev, res.data.session]);
               setShowCreate(false);
               setNewSession({ title: '', room: 'Main Hall', startTime: '', endTime: '', capacity: 50, speakerName: '', color: '#6366f1' });
               setConflicts([]);
          } catch (err) {
               console.error(err);
          }
     };

     const getCapacityColor = (registered, capacity) => {
          const ratio = registered / capacity;
          if (ratio >= 0.9) return 'bg-red-500';
          if (ratio >= 0.7) return 'bg-yellow-500';
          return 'bg-green-500';
     };

     return (
          <div className="space-y-6 animate-fade-in">
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-2xl font-bold text-[var(--text-primary)]">Session Scheduler</h1>
                         <p className="text-[var(--text-muted)] mt-1">Drag and drop to manage your event schedule</p>
                    </div>
                    <button onClick={() => setShowCreate(true)} className="btn btn-primary">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                         </svg>
                         Add Session
                    </button>
               </div>

               {/* Create Modal */}
               {showCreate && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => { setShowCreate(false); setConflicts([]); }}>
                         <div className="glass-card p-6 w-full max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center justify-between mb-6">
                                   <h2 className="text-xl font-bold text-[var(--text-primary)]">Schedule New Session</h2>
                                   <button onClick={() => { setShowCreate(false); setConflicts([]); }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                   </button>
                              </div>

                              <div className="space-y-4">
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Session Title</label>
                                        <input className="input" placeholder="e.g. Keynote Speech" value={newSession.title} onChange={e => setNewSession({ ...newSession, title: e.target.value })} autoFocus />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Speaker</label>
                                        <input className="input" placeholder="Speaker Name" value={newSession.speakerName} onChange={e => setNewSession({ ...newSession, speakerName: e.target.value })} />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Room</label>
                                             <select className="input" value={newSession.room} onChange={e => setNewSession({ ...newSession, room: e.target.value })}>
                                                  {rooms.map(r => <option key={r} value={r}>{r}</option>)}
                                             </select>
                                        </div>
                                        <div>
                                             <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Capacity</label>
                                             <input type="number" className="input" placeholder="50" value={newSession.capacity} onChange={e => setNewSession({ ...newSession, capacity: Number(e.target.value) })} />
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Start Time</label>
                                             <input type="datetime-local" className="input" value={newSession.startTime} onChange={e => setNewSession({ ...newSession, startTime: e.target.value })} />
                                        </div>
                                        <div>
                                             <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">End Time</label>
                                             <input type="datetime-local" className="input" value={newSession.endTime} onChange={e => setNewSession({ ...newSession, endTime: e.target.value })} />
                                        </div>
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Session Color</label>
                                        <div className="flex gap-2">
                                             {['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'].map(color => (
                                                  <button
                                                       key={color}
                                                       onClick={() => setNewSession({ ...newSession, color })}
                                                       className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${newSession.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                                                       style={{ backgroundColor: color }}
                                                  />
                                             ))}
                                        </div>
                                   </div>

                                   {conflicts.length > 0 && (
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-up">
                                             <div className="flex items-center gap-2 font-semibold mb-1">
                                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                  </svg>
                                                  Scheduling Conflicts
                                             </div>
                                             <ul className="list-disc list-inside opacity-90 space-y-0.5">
                                                  {conflicts.map((c, i) => <li key={i}>{c.message}</li>)}
                                             </ul>
                                        </div>
                                   )}

                                   <div className="flex gap-3 pt-4 border-t border-[var(--border-color)] mt-6">
                                        <button onClick={() => { setShowCreate(false); setConflicts([]); }} className="btn btn-secondary flex-1">Cancel</button>
                                        <button onClick={handleCreate} className="btn btn-primary flex-1">Confirm Schedule</button>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}

               {/* Schedule Grid */}
               <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                         <div className="min-w-[900px]">
                              {/* Header */}
                              <div className="grid grid-cols-6 border-b border-[var(--border-color)] bg-[var(--bg-elevated)]/50">
                                   <div className="p-3 text-sm font-semibold text-[var(--text-muted)] border-r border-[var(--border-color)] text-center w-24 sticky left-0 bg-[var(--bg-card)] z-10">
                                        Time
                                   </div>
                                   {rooms.map(room => (
                                        <div key={room} className="p-3 text-sm font-semibold text-[var(--text-primary)] border-r border-[var(--border-color)] last:border-r-0 text-center">
                                             {room}
                                        </div>
                                   ))}
                              </div>

                              {/* Time Rows */}
                              {hours.map(hour => (
                                   <div key={hour} className="grid grid-cols-6 border-b border-[var(--border-color)] last:border-b-0 hover:bg-[var(--bg-elevated)]/20 transition-colors">
                                        <div className="p-3 py-6 text-xs font-medium text-[var(--text-muted)] border-r border-[var(--border-color)] text-center w-24 sticky left-0 bg-[var(--bg-card)] z-10 flex items-center justify-center">
                                             {hour}:00
                                        </div>
                                        {rooms.map(room => {
                                             const session = sessions.find(s =>
                                                  s.room === room &&
                                                  new Date(s.startTime).getHours() === hour
                                             );
                                             return (
                                                  <div key={room} className="p-1 relative border-r border-[var(--border-color)] last:border-r-0 min-h-[80px]">
                                                       {session && (
                                                            <div
                                                                 className="absolute inset-1 rounded-lg p-2.5 text-white text-xs cursor-pointer hover:scale-[1.02] transition-all shadow-lg animate-scale-in group z-0 hover:z-20"
                                                                 style={{ backgroundColor: session.color || '#6366f1' }}
                                                            >
                                                                 <p className="font-bold truncate text-sm leading-tight">{session.title}</p>
                                                                 <p className="opacity-90 truncate mt-0.5">{session.speakerName}</p>
                                                                 <div className="mt-2 flex items-center justify-between">
                                                                      <div className="flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded text-[10px]">
                                                                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                                           </svg>
                                                                           {session.registered}/{session.capacity}
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       )}
                                                  </div>
                                             );
                                        })}
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>

               {/* Session List */}
               <div className="gradient-border-card p-6">
                    <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                         All Sessions
                    </h2>
                    {sessions.length === 0 ? (
                         <div className="text-center py-12">
                              <p className="text-4xl mb-3 animate-float">📅</p>
                              <p className="text-[var(--text-muted)]">No sessions scheduled yet</p>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {sessions.map(session => (
                                   <div key={session._id} className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-all group">
                                        <div className="flex items-start justify-between mb-2">
                                             <div className="flex items-center gap-2">
                                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: session.color || '#6366f1' }} />
                                                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{session.room}</span>
                                             </div>
                                             <span className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-card)] px-2 py-0.5 rounded">
                                                  {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                             </span>
                                        </div>
                                        <h4 className="font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--color-primary-light)] transition-colors">{session.title}</h4>
                                        <p className="text-sm text-[var(--text-muted)] flex items-center gap-1.5 mb-3">
                                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                             </svg>
                                             {session.speakerName || 'No Speaker'}
                                        </p>
                                        <div className="w-full bg-[var(--bg-card)] h-1.5 rounded-full overflow-hidden">
                                             <div
                                                  className="h-full bg-[var(--color-primary)] transition-all duration-500"
                                                  style={{ width: `${Math.min((session.registered / session.capacity) * 100, 100)}%` }}
                                             />
                                        </div>
                                        <div className="flex justify-between mt-1.5 text-[10px] text-[var(--text-muted)]">
                                             <span>{session.registered} registered</span>
                                             <span>{session.capacity} capacity</span>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>
          </div>
     );
}
