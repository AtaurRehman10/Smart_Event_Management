import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { venueApi } from '../../api/venueApi';

export default function VenueViewer() {
     const { eventId } = useParams();
     const [elements, setElements] = useState([]);
     const [loading, setLoading] = useState(true);
     const [selectedId, setSelectedId] = useState(null);
     const svgRef = useRef(null);

     useEffect(() => {
          venueApi.getFloorPlan(eventId)
               .then(res => {
                    setElements(res.data.elements || []);
               })
               .catch(console.error)
               .finally(() => setLoading(false));
     }, [eventId]);

     const sel = elements.find(el => el.id === selectedId);

     if (loading) return (
          <div className="flex items-center justify-center h-[60vh] text-[var(--text-muted)] animate-pulse">
               <svg className="w-8 h-8 mr-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Loading venue map...
          </div>
     );

     return (
          <div className="space-y-6 animate-fade-in h-[calc(100vh-100px)] flex flex-col">
               <div className="flex items-center justify-between shrink-0">
                    <div>
                         <h1 className="text-2xl font-bold text-[var(--text-primary)]">Venue Map</h1>
                         <p className="text-[var(--text-muted)] text-sm mt-0.5">Explore the event layout and find your way</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-color)]">
                         <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                         Live Capacity
                    </div>
               </div>

               <div className="flex gap-6 flex-1 min-h-0">
                    <div className="flex-1 glass-card p-0 overflow-hidden relative group cursor-grab active:cursor-grabbing">
                         <svg
                              ref={svgRef}
                              width="100%" height="100%"
                              viewBox="0 0 1200 800"
                              className="bg-[#0f172a]"
                              onClick={() => setSelectedId(null)}
                         >
                              <defs>
                                   <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.5" />
                                   </pattern>
                              </defs>
                              <rect width="1200" height="800" fill="url(#grid)" />

                              {elements.map(el => (
                                   <g
                                        key={el.id}
                                        onClick={e => { e.stopPropagation(); setSelectedId(el.id); }}
                                        className="transition-all hover:opacity-100 cursor-pointer"
                                        style={{ opacity: selectedId && selectedId !== el.id ? 0.4 : 1 }}
                                   >
                                        <rect
                                             x={el.x} y={el.y} width={el.width} height={el.height} rx={4}
                                             fill={el.color + '40'}
                                             stroke={selectedId === el.id ? '#fff' : el.color}
                                             strokeWidth={selectedId === el.id ? 3 : 1}
                                             className="transition-all duration-300"
                                             style={{
                                                  filter: selectedId === el.id ? `drop-shadow(0 0 15px ${el.color})` : 'none'
                                             }}
                                        />
                                        <text
                                             x={el.x + el.width / 2} y={el.y + el.height / 2}
                                             textAnchor="middle" dominantBaseline="middle"
                                             fill="#fff" fontSize="14" fontWeight="600"
                                             style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                                             className="pointer-events-none select-none"
                                        >
                                             {el.label}
                                        </text>

                                        {/* Capacity Indicator */}
                                        <rect
                                             x={el.x + 8} y={el.y + el.height - 18}
                                             width={el.width - 16} height="4" rx="2"
                                             fill="rgba(0,0,0,0.5)"
                                        />
                                        <rect
                                             x={el.x + 8} y={el.y + el.height - 18}
                                             width={(el.width - 16) * Math.min(1, Math.random())} // Mock utilization
                                             height="4" rx="2"
                                             fill={el.color}
                                        />
                                   </g>
                              ))}
                         </svg>

                         {/* Selection Popover */}
                         {sel && (
                              <div
                                   className="absolute glass-card p-4 w-64 animate-scale-in origin-bottom-left shadow-2xl border border-[var(--border-color)]"
                                   style={{
                                        left: Math.min(sel.x + sel.width + 20, 1200 - 300), // simplistic positioning
                                        top: Math.max(sel.y, 20),
                                   }}
                              >
                                   <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-lg text-[var(--text-primary)]">{sel.label}</h3>
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedId(null); }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                   </div>

                                   <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                             <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-lg">
                                                  👥
                                             </div>
                                             <div>
                                                  <div className="font-medium text-[var(--text-primary)]">Capacity</div>
                                                  <div>{sel.capacity || 50} people</div>
                                             </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                             <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-lg">
                                                  📍
                                             </div>
                                             <div>
                                                  <div className="font-medium text-[var(--text-primary)]">Location</div>
                                                  <div>Floor 1, Zone A</div>
                                             </div>
                                        </div>

                                        <div className="pt-3 mt-1">
                                             <button className="btn btn-secondary w-full text-sm">View Schedule</button>
                                        </div>
                                   </div>
                              </div>
                         )}

                         <div className="absolute bottom-6 left-6 text-sm flex gap-4">
                              <div className="flex items-center gap-2">
                                   <div className="w-3 h-3 rounded-full bg-[#6366f1]"></div>
                                   <span className="text-white drop-shadow-md">Rooms</span>
                              </div>
                              <div className="flex items-center gap-2">
                                   <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                                   <span className="text-white drop-shadow-md">Booths</span>
                              </div>
                              <div className="flex items-center gap-2">
                                   <div className="w-3 h-3 rounded-full bg-[#f43f5e]"></div>
                                   <span className="text-white drop-shadow-md">Stages</span>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}
