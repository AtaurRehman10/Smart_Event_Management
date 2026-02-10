import { useState } from 'react';

export default function Networking() {
     const [cards, setCards] = useState([]);
     const [showExchange, setShowExchange] = useState(false);
     const [myCard, setMyCard] = useState({ name: '', email: '', phone: '', organization: '', title: '', linkedin: '' });

     const saveCard = () => {
          setCards(prev => [...prev, { ...myCard, id: Date.now(), createdAt: new Date() }]);
          setShowExchange(false);
     };

     return (
          <div className="space-y-6 animate-fade-in">
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-2xl font-bold text-[var(--text-primary)]">Networking Hub</h1>
                         <p className="text-[var(--text-muted)] mt-1">Connect with other attendees and exchange digital cards</p>
                    </div>
                    <button onClick={() => setShowExchange(true)} className="btn btn-primary">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                         </svg>
                         Exchange Card
                    </button>
               </div>

               {showExchange && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowExchange(false)}>
                         <div className="glass-card p-8 w-full max-w-md animate-scale-in relative overflow-hidden" onClick={e => e.stopPropagation()}>
                              <div className="orb orb-secondary w-[200px] h-[200px] top-[-20%] right-[-20%] opacity-[0.2]" />

                              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                   <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white text-sm">📇</span>
                                   Share Your Card
                              </h2>

                              <div className="space-y-4">
                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Full Name</label>
                                             <input className="input" placeholder="e.g. Alex Doe" value={myCard.name} onChange={e => setMyCard({ ...myCard, name: e.target.value })} autoFocus />
                                        </div>
                                        <div>
                                             <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Title</label>
                                             <input className="input" placeholder="e.g. Developer" value={myCard.title} onChange={e => setMyCard({ ...myCard, title: e.target.value })} />
                                        </div>
                                   </div>
                                   <div>
                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Organization</label>
                                        <input className="input" placeholder="e.g. Tech Corp" value={myCard.organization} onChange={e => setMyCard({ ...myCard, organization: e.target.value })} />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Email</label>
                                             <input className="input" placeholder="alex@example.com" value={myCard.email} onChange={e => setMyCard({ ...myCard, email: e.target.value })} />
                                        </div>
                                        <div>
                                             <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Phone</label>
                                             <input className="input" placeholder="+1 234..." value={myCard.phone} onChange={e => setMyCard({ ...myCard, phone: e.target.value })} />
                                        </div>
                                   </div>
                                   <div>
                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">LinkedIn</label>
                                        <div className="relative">
                                             <span className="absolute left-3 top-2.5 text-[var(--text-muted)]">
                                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                             </span>
                                             <input className="input pl-9" placeholder="linkedin.com/in/..." value={myCard.linkedin} onChange={e => setMyCard({ ...myCard, linkedin: e.target.value })} />
                                        </div>
                                   </div>

                                   <div className="flex gap-3 pt-4 border-t border-[var(--border-color)] mt-6">
                                        <button onClick={() => setShowExchange(false)} className="btn btn-secondary flex-1">Cancel</button>
                                        <button onClick={saveCard} className="btn btn-primary flex-1">Share Card</button>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}

               {cards.length === 0 ? (
                    <div className="text-center py-20">
                         <div className="w-24 h-24 rounded-full bg-[var(--bg-elevated)] mx-auto flex items-center justify-center mb-6 animate-pulse-glow">
                              <span className="text-4xl">🤝</span>
                         </div>
                         <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Start Networking</h3>
                         <p className="text-[var(--text-muted)] max-w-sm mx-auto mb-8">You haven't collected any business cards yet. Exchange contact info with other attendees to build your network.</p>
                         <button onClick={() => setShowExchange(true)} className="btn btn-primary">Create Your Card</button>
                    </div>
               ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {cards.map((card, i) => (
                              <div key={card.id} className="glass-card p-0 overflow-hidden group hover:scale-[1.02] transition-transform duration-300 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                   {/* Card Header / Banner */}
                                   <div className="h-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] relative">
                                        <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/0" />
                                        <div className="absolute -bottom-8 left-6">
                                             <div className="w-16 h-16 rounded-xl bg-[var(--bg-card)] p-1 shadow-lg">
                                                  <div className="w-full h-full rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-2xl font-bold text-[var(--text-primary)] border border-[var(--border-color)]">
                                                       {card.name.charAt(0)}
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Card Body */}
                                   <div className="pt-10 pb-6 px-6">
                                        <div className="flex justify-between items-start mb-1">
                                             <div>
                                                  <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--color-primary-light)] transition-colors">{card.name}</h3>
                                                  <p className="text-sm text-[var(--color-primary)] font-medium">{card.title}</p>
                                             </div>
                                             {card.linkedin && (
                                                  <a href={card.linkedin} target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[#0077b5] transition-colors">
                                                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                                  </a>
                                             )}
                                        </div>

                                        <div className="text-sm text-[var(--text-secondary)] mb-4 flex items-center gap-1.5">
                                             <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                             {card.organization}
                                        </div>

                                        <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                                             {card.email && (
                                                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                                                       <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                       {card.email}
                                                  </div>
                                             )}
                                             {card.phone && (
                                                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                                                       <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                       {card.phone}
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}
          </div>
     );
}
