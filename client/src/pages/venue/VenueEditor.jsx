import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { venueApi } from '../../api/venueApi';

const TYPES = [
     { type: 'room', label: 'Room', icon: '🏠', color: '#6366f1' },
     { type: 'booth', label: 'Booth', icon: '🏪', color: '#06b6d4' },
     { type: 'stage', label: 'Stage', icon: '🎤', color: '#f59e0b' },
     { type: 'entrance', label: 'Entrance', icon: '🚪', color: '#10b981' },
];

export default function VenueEditor() {
     const { eventId } = useParams();
     const svgRef = useRef(null);
     const [elements, setElements] = useState([]);
     const [selectedId, setSelectedId] = useState(null);
     const [dragging, setDragging] = useState(null);
     const [offset, setOffset] = useState({ x: 0, y: 0 });

     const addElement = (type) => {
          const c = TYPES.find(t => t.type === type);
          const el = {
               id: `el-${Date.now()}`, type,
               x: 200 + Math.random() * 400, y: 150 + Math.random() * 300,
               width: type === 'booth' ? 80 : 150, height: type === 'booth' ? 80 : 100,
               label: `${c.label} ${elements.length + 1}`, capacity: 50, color: c.color,
          };
          setElements(prev => [...prev, el]);
          setSelectedId(el.id);
     };

     const onMouseDown = (e, el) => {
          e.stopPropagation();
          setSelectedId(el.id);
          const r = svgRef.current.getBoundingClientRect();
          setDragging(el.id);
          setOffset({ x: e.clientX - r.left - el.x, y: e.clientY - r.top - el.y });
     };

     const onMouseMove = (e) => {
          if (!dragging) return;
          const r = svgRef.current.getBoundingClientRect();
          setElements(prev => prev.map(el =>
               el.id === dragging ? { ...el, x: Math.max(0, e.clientX - r.left - offset.x), y: Math.max(0, e.clientY - r.top - offset.y) } : el
          ));
     };

     const update = (id, f, v) => setElements(prev => prev.map(el => el.id === id ? { ...el, [f]: v } : el));
     const sel = elements.find(el => el.id === selectedId);

     const save = async () => {
          try {
               await venueApi.create({ event: eventId, name: 'Main Venue', elements, width: 1200, height: 800 });
               alert('Saved!');
          } catch (err) { console.error(err); }
     };

     return (
          <div className="space-y-4 animate-fade-in h-[calc(100vh-100px)] flex flex-col">
               <div className="flex items-center justify-between shrink-0">
                    <div>
                         <h1 className="text-2xl font-bold text-[var(--text-primary)]">Venue Floor Plan Editor</h1>
                         <p className="text-[var(--text-muted)] text-sm mt-0.5">Design your event layout</p>
                    </div>
                    <div className="flex gap-3">
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-color)]">
                              <span>X: {Math.round(offset.x)}</span>
                              <span>Y: {Math.round(offset.y)}</span>
                         </div>
                         <button onClick={save} className="btn btn-primary flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                              Save Layout
                         </button>
                    </div>
               </div>

               <div className="flex gap-6 flex-1 min-h-0">
                    {/* Tool Palette */}
                    <div className="w-16 flex flex-col gap-2 shrink-0">
                         <div className="glass-card p-2 flex flex-col gap-2 items-center">
                              {TYPES.map(t => (
                                   <button
                                        key={t.type}
                                        onClick={() => addElement(t.type)}
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl hover:bg-[var(--bg-elevated)] hover:text-[var(--color-primary)] transition-all relative group tooltip-container"
                                        title={t.label}
                                   >
                                        {t.icon}
                                        <div className="absolute left-full ml-2 px-2 py-1 rounded bg-black/80 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                             Add {t.label}
                                        </div>
                                   </button>
                              ))}
                              <div className="h-px w-8 bg-[var(--border-color)] my-1" />
                              <button
                                   onClick={() => setElements([])}
                                   className="w-10 h-10 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
                                   title="Clear All"
                              >
                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                         </div>
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 glass-card p-0 overflow-hidden relative group cursor-crosshair">
                         <svg
                              ref={svgRef}
                              width="100%" height="100%"
                              viewBox="0 0 1200 800"
                              className="bg-[#0f172a]"
                              onMouseMove={onMouseMove}
                              onMouseUp={() => setDragging(null)}
                              onClick={() => setSelectedId(null)}
                         >
                              <defs>
                                   <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.5" />
                                   </pattern>
                                   <pattern id="grid-small" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.2" />
                                   </pattern>
                              </defs>
                              <rect width="1200" height="800" fill="url(#grid-small)" />
                              <rect width="1200" height="800" fill="url(#grid)" />

                              {elements.map(el => (
                                   <g
                                        key={el.id}
                                        onMouseDown={e => onMouseDown(e, el)}
                                        style={{ cursor: dragging === el.id ? 'grabbing' : 'grab' }}
                                        className="transition-opacity hover:opacity-90"
                                   >
                                        <rect
                                             x={el.x} y={el.y} width={el.width} height={el.height} rx={4}
                                             fill={el.color + '40'}
                                             stroke={selectedId === el.id ? '#fff' : el.color}
                                             strokeWidth={selectedId === el.id ? 2 : 1}
                                             className="transition-colors"
                                        />
                                        <text
                                             x={el.x + el.width / 2} y={el.y + el.height / 2}
                                             textAnchor="middle" dominantBaseline="middle"
                                             fill="#e2e8f0" fontSize="12" fontWeight="600"
                                             className="select-none pointer-events-none"
                                             style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                                        >
                                             {el.label}
                                        </text>

                                        {/* Resize handles (visual only for now) */}
                                        {selectedId === el.id && (
                                             <>
                                                  <circle cx={el.x} cy={el.y} r="3" fill="white" />
                                                  <circle cx={el.x + el.width} cy={el.y} r="3" fill="white" />
                                                  <circle cx={el.x} cy={el.y + el.height} r="3" fill="white" />
                                                  <circle cx={el.x + el.width} cy={el.y + el.height} r="3" fill="white" />
                                             </>
                                        )}
                                   </g>
                              ))}
                         </svg>

                         <div className="absolute bottom-4 right-4 text-xs text-white/50 bg-black/20 px-2 py-1 rounded backdrop-blur max-w-xs text-right pointer-events-none">
                              Click and drag to move • Select element to edit properties
                         </div>
                    </div>

                    {/* Properties Panel */}
                    <div className="w-72 shrink-0">
                         {sel ? (
                              <div className="glass-card p-5 h-full animate-slide-left flex flex-col">
                                   <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-[var(--text-primary)]">Element Properties</h3>
                                        <button onClick={() => setSelectedId(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                   </div>

                                   <div className="space-y-4 flex-1 overflow-y-auto">
                                        <div>
                                             <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Label</label>
                                             <input className="input" value={sel.label} onChange={e => update(selectedId, 'label', e.target.value)} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                             <div>
                                                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Width</label>
                                                  <input type="number" className="input" value={sel.width} onChange={e => update(selectedId, 'width', +e.target.value)} />
                                             </div>
                                             <div>
                                                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Height</label>
                                                  <input type="number" className="input" value={sel.height} onChange={e => update(selectedId, 'height', +e.target.value)} />
                                             </div>
                                        </div>

                                        <div>
                                             <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Capacity</label>
                                             <div className="relative">
                                                  <input type="number" className="input pr-8" value={sel.capacity} onChange={e => update(selectedId, 'capacity', +e.target.value)} />
                                                  <span className="absolute right-3 top-2.5 text-[var(--text-muted)] text-xs">pax</span>
                                             </div>
                                        </div>

                                        <div className="pt-4 border-t border-[var(--border-color)]">
                                             <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Position</label>
                                             <div className="grid grid-cols-2 gap-3">
                                                  <div className="bg-[var(--bg-elevated)] p-2 rounded text-xs font-mono text-[var(--text-muted)]">X: {Math.round(sel.x)}</div>
                                                  <div className="bg-[var(--bg-elevated)] p-2 rounded text-xs font-mono text-[var(--text-muted)]">Y: {Math.round(sel.y)}</div>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
                                        <button onClick={() => { setElements(prev => prev.filter(el => el.id !== selectedId)); setSelectedId(null); }} className="btn w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20">
                                             Delete Element
                                        </button>
                                   </div>
                              </div>
                         ) : (
                              <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center text-[var(--text-muted)] animate-fade-in">
                                   <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4 border border-[var(--border-color)]">
                                        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                   </div>
                                   <h3 className="font-medium text-[var(--text-primary)]">No Selection</h3>
                                   <p className="text-sm mt-1 opacity-70">Select an element on the canvas to view and edit its properties.</p>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}
