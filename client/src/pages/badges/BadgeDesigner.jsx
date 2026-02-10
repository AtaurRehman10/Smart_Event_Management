import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';

const BADGE_WIDTH = 400;
const BADGE_HEIGHT = 250;

const TEMPLATES = [
     { name: 'Classic', bg: '#1e1b4b', accent: '#6366f1', textColor: '#ffffff' },
     { name: 'Ocean', bg: '#0c4a6e', accent: '#06b6d4', textColor: '#ffffff' },
     { name: 'Sunset', bg: '#431407', accent: '#f59e0b', textColor: '#ffffff' },
     { name: 'Forest', bg: '#052e16', accent: '#10b981', textColor: '#ffffff' },
];

export default function BadgeDesigner() {
     const canvasRef = useRef(null);
     const [template, setTemplate] = useState(TEMPLATES[0]);
     const [elements, setElements] = useState([
          { id: 1, type: 'text', content: '{{name}}', x: 200, y: 80, fontSize: 24, color: '#ffffff', fontWeight: 'bold' },
          { id: 2, type: 'text', content: '{{organization}}', x: 200, y: 120, fontSize: 14, color: '#94a3b8', fontWeight: 'normal' },
          { id: 3, type: 'text', content: '{{role}}', x: 200, y: 155, fontSize: 12, color: '#6366f1', fontWeight: 'bold' },
          { id: 4, type: 'text', content: 'DevCon 2026', x: 200, y: 220, fontSize: 11, color: '#64748b', fontWeight: 'normal' },
     ]);
     const [selectedId, setSelectedId] = useState(null);
     const [dragging, setDragging] = useState(null);

     const sel = elements.find(e => e.id === selectedId);

     const update = (id, field, value) => setElements(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));

     const addText = () => {
          const el = { id: Date.now(), type: 'text', content: 'New Text', x: 200, y: 150, fontSize: 16, color: '#ffffff', fontWeight: 'normal' };
          setElements(prev => [...prev, el]);
          setSelectedId(el.id);
     };

     const exportPDF = () => {
          const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [BADGE_WIDTH, BADGE_HEIGHT] });
          doc.setFillColor(template.bg);
          doc.rect(0, 0, BADGE_WIDTH, BADGE_HEIGHT, 'F');
          elements.forEach(el => {
               doc.setFontSize(el.fontSize);
               doc.setTextColor(el.color);
               doc.text(el.content, el.x, el.y, { align: 'center' });
          });
          doc.save('badge.pdf');
     };

     return (
          <div className="space-y-6 animate-fade-in h-[calc(100vh-100px)] flex flex-col">
               <div className="flex items-center justify-between shrink-0">
                    <div>
                         <h1 className="text-2xl font-bold text-[var(--text-primary)]">Badge Designer</h1>
                         <p className="text-[var(--text-muted)] text-sm mt-0.5">Customize attendee badges for your event</p>
                    </div>
                    <div className="flex gap-3">
                         <button onClick={addText} className="btn btn-secondary flex items-center gap-2">
                              <span className="text-lg leading-none">+</span> Add Text
                         </button>
                         <button onClick={exportPDF} className="btn btn-primary flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                              Export PDF
                         </button>
                    </div>
               </div>

               <div className="flex gap-6 flex-1 min-h-0">
                    {/* Templates Sidebar */}
                    <div className="w-64 flex flex-col gap-4">
                         <div className="glass-card p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
                              <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Templates</h3>
                              <div className="space-y-3">
                                   {TEMPLATES.map(t => (
                                        <button
                                             key={t.name}
                                             onClick={() => setTemplate(t)}
                                             className={`w-full group relative rounded-xl overflow-hidden transition-all duration-300 ${template.name === t.name ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--bg-elevated)]' : 'hover:scale-[1.02]'}`}
                                        >
                                             <div className="h-20 w-full" style={{ backgroundColor: t.bg }}>
                                                  <div className="h-full w-2 bg-white/20" />
                                             </div>
                                             <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/40 backdrop-blur text-xs font-medium text-white">
                                                  {t.name}
                                             </div>
                                        </button>
                                   ))}
                              </div>

                              <div className="border-t border-[var(--border-color)] pt-4 mt-2">
                                   <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Variables</h3>
                                   <div className="flex flex-wrap gap-2">
                                        {['{{name}}', '{{role}}', '{{organization}}'].map(v => (
                                             <code key={v} className="px-2 py-1 rounded bg-[var(--bg-elevated)] text-[var(--color-primary)] text-xs cursor-help" title="Click to copy or use in text">{v}</code>
                                        ))}
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 flex items-center justify-center bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] relative overflow-hidden">
                         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border-color) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                         <div className="relative shadow-2xl rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
                              <svg
                                   ref={canvasRef}
                                   width={BADGE_WIDTH}
                                   height={BADGE_HEIGHT}
                                   viewBox={`0 0 ${BADGE_WIDTH} ${BADGE_HEIGHT}`}
                                   className="bg-white cursor-pointer"
                                   onClick={() => setSelectedId(null)}
                              >
                                   <rect width={BADGE_WIDTH} height={BADGE_HEIGHT} fill={template.bg} />
                                   <rect x={0} y={0} width={12} height={BADGE_HEIGHT} fill={template.accent} />

                                   {/* Decorative Elements based on template */}
                                   <circle cx={BADGE_WIDTH - 20} cy={20} r={60} fill={template.accent} fillOpacity="0.1" />
                                   <circle cx={40} cy={BADGE_HEIGHT - 20} r={40} fill={template.accent} fillOpacity="0.1" />

                                   {elements.map(el => (
                                        <text
                                             key={el.id}
                                             x={el.x}
                                             y={el.y}
                                             textAnchor="middle"
                                             fill={el.color}
                                             fontSize={el.fontSize}
                                             fontWeight={el.fontWeight}
                                             className="cursor-move select-none"
                                             onClick={e => { e.stopPropagation(); setSelectedId(el.id); }}
                                             style={{
                                                  filter: selectedId === el.id ? 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' : 'none',
                                                  opacity: dragging === el.id ? 0.8 : 1
                                             }}
                                        >
                                             {el.content}
                                        </text>
                                   ))}
                              </svg>
                         </div>

                         <div className="absolute bottom-4 left-4 text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)] px-3 py-1.5 rounded-full border border-[var(--border-color)]">
                              {BADGE_WIDTH}px × {BADGE_HEIGHT}px
                         </div>
                    </div>

                    {/* Properties Panel */}
                    <div className="w-72 flex flex-col">
                         {sel ? (
                              <div className="glass-card p-5 h-full animate-slide-left settings-panel">
                                   <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-[var(--text-primary)]">Edit Element</h3>
                                        <button onClick={() => setSelectedId(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                   </div>

                                   <div className="space-y-5">
                                        <div>
                                             <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Content</label>
                                             <input
                                                  className="input"
                                                  value={sel.content}
                                                  onChange={e => update(sel.id, 'content', e.target.value)}
                                             />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                             <div>
                                                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">X Position</label>
                                                  <input type="number" className="input" value={sel.x} onChange={e => update(sel.id, 'x', +e.target.value)} />
                                             </div>
                                             <div>
                                                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Y Position</label>
                                                  <input type="number" className="input" value={sel.y} onChange={e => update(sel.id, 'y', +e.target.value)} />
                                             </div>
                                        </div>

                                        <div>
                                             <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Typography</label>
                                             <div className="space-y-4">
                                                  <div className="flex items-center gap-3">
                                                       <input
                                                            type="range"
                                                            min="12"
                                                            max="72"
                                                            value={sel.fontSize}
                                                            onChange={e => update(sel.id, 'fontSize', +e.target.value)}
                                                            className="flex-1 accent-[var(--color-primary)]"
                                                       />
                                                       <span className="text-sm font-mono w-8 text-right text-[var(--text-secondary)]">{sel.fontSize}</span>
                                                  </div>

                                                  <div className="flex gap-2">
                                                       <button
                                                            onClick={() => update(sel.id, 'fontWeight', sel.fontWeight === 'bold' ? 'normal' : 'bold')}
                                                            className={`flex-1 py-1.5 rounded border text-sm font-bold transition-all ${sel.fontWeight === 'bold' ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]'}`}
                                                       >
                                                            B
                                                       </button>
                                                       <div className="flex-1 relative h-9 rounded border border-[var(--border-color)] overflow-hidden cursor-pointer">
                                                            <input
                                                                 type="color"
                                                                 value={sel.color}
                                                                 onChange={e => update(sel.id, 'color', e.target.value)}
                                                                 className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                                                            />
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-[var(--border-color)]">
                                             <button
                                                  onClick={() => { setElements(prev => prev.filter(e => e.id !== sel.id)); setSelectedId(null); }}
                                                  className="btn w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                                             >
                                                  Delete Element
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         ) : (
                              <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center text-[var(--text-muted)] animate-fade-in">
                                   <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                   </div>
                                   <p className="font-medium">No element selected</p>
                                   <p className="text-sm mt-1 opacity-70">Click on any element on the badge to edit its properties.</p>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}
