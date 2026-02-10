import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
     Ticket,
     Crown,
     Sparkles,
     User,
     Mail,
     Building2,
     Briefcase,
     CheckCircle2,
     AlertCircle,
     ChevronRight,
     ArrowLeft,
     CreditCard,
     Phone,
     Globe,
     Tag
} from 'lucide-react';

export default function RegistrationForm() {
     const { eventId } = useParams();
     const [step, setStep] = useState(0);
     const [selectedTicket, setSelectedTicket] = useState(null);
     const [formData, setFormData] = useState({
          name: '',
          email: '',
          phone: '',
          company: '',
          title: '',
          industry: '',
          attendeeType: 'Attendee',
          promoCode: ''
     });
     const [loading, setLoading] = useState(false);
     const [success, setSuccess] = useState(null);
     const [error, setError] = useState('');

     const tickets = [
          { _id: '1', name: 'General Admission', type: 'General', price: 99, currentPrice: 79, available: 45, icon: Ticket },
          { _id: '2', name: 'VIP Pass', type: 'VIP', price: 299, currentPrice: 249, available: 12, icon: Crown },
          { _id: '3', name: 'Workshop Bundle', type: 'Workshop', price: 149, currentPrice: 149, available: 30, icon: Sparkles },
     ];

     const handleRegister = async () => {
          setLoading(true);
          setError('');
          try {
               setTimeout(() => {
                    setSuccess({ qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DevCon-Pass' });
                    setStep(2);
                    setLoading(false);
               }, 1500);
          } catch (err) {
               setError('Registration failed. Please check your connection.');
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30">
               <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px]" />
               </div>

               <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">

                    {step < 2 && (
                         <div className="mb-12">
                              <button onClick={() => step === 1 ? setStep(0) : null} className={`flex items-center gap-2 text-sm font-medium mb-6 transition-colors ${step === 1 ? 'text-slate-400 hover:text-white' : 'text-transparent pointer-events-none'}`}>
                                   <ArrowLeft size={16} /> Back to tickets
                              </button>
                              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">
                                   Secure Your <span className="text-indigo-500">Access</span>
                              </h1>

                              <div className="flex items-center gap-4">
                                   <StepIndicator num={1} label="Select Ticket" active={step >= 0} complete={step > 0} />
                                   <div className="w-12 h-[1px] bg-slate-800" />
                                   <StepIndicator num={2} label="Attendee Details" active={step >= 1} complete={step > 1} />
                              </div>
                         </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                         <div className={step === 1 ? "lg:col-span-8" : "lg:col-span-12"}>

                              {step === 0 && (
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {tickets.map((ticket) => (
                                             <TicketCard
                                                  key={ticket._id}
                                                  ticket={ticket}
                                                  onSelect={() => { setSelectedTicket(ticket); setStep(1); }}
                                             />
                                        ))}
                                   </div>
                              )}

                              {step === 1 && selectedTicket && (
                                   <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 md:p-10 backdrop-blur-sm">
                                             <div className="flex items-center gap-3 mb-8">
                                                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                                       <User size={20} />
                                                  </div>
                                                  <h3 className="text-xl font-bold">Attendee Information</h3>
                                             </div>

                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                  <FormInput label="Full Name" icon={User} placeholder="John Doe" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                                                  <FormInput label="Work Email" icon={Mail} type="email" placeholder="john@company.com" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                                                  <FormInput label="Phone Number" icon={Phone} placeholder="+1 (555) 000-0000" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                                                  <FormInput label="Industry" icon={Globe} placeholder="e.g. Technology" value={formData.industry} onChange={v => setFormData({ ...formData, industry: v })} />
                                                  <FormInput label="Organization" icon={Building2} placeholder="Acme Inc." value={formData.company} onChange={v => setFormData({ ...formData, company: v })} />
                                                  <FormInput label="Job Title" icon={Briefcase} placeholder="Senior Developer" value={formData.title} onChange={v => setFormData({ ...formData, title: v })} />
                                             </div>
                                        </div>

                                        {error && <ErrorMessage message={error} />}

                                        <button
                                             onClick={handleRegister}
                                             disabled={loading || !formData.name || !formData.email}
                                             className="w-full flex h-14 items-center justify-center gap-3 rounded-xl bg-indigo-600 px-8 text-base font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                                        >
                                             {loading ? (
                                                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                             ) : (
                                                  <>Complete Registration <ChevronRight size={18} /></>
                                             )}
                                        </button>
                                   </div>
                              )}

                              {step === 2 && success && (
                                   <div className="max-w-xl mx-auto rounded-3xl border border-emerald-500/20 bg-slate-900/40 p-8 md:p-12 text-center backdrop-blur-md animate-in zoom-in-95 duration-500">
                                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500">
                                             <CheckCircle2 size={40} />
                                        </div>
                                        <h2 className="text-3xl font-bold mb-3 text-white">Registration Confirmed</h2>
                                        <p className="text-slate-400 mb-10 leading-relaxed">
                                             We've sent your digital pass to <span className="text-white font-medium">{formData.email}</span>.
                                        </p>

                                        <div className="relative group mx-auto w-48 mb-10">
                                             <div className="absolute inset-0 bg-white/20 blur-xl rounded-full transition-opacity group-hover:opacity-100 opacity-50" />
                                             <img src={success.qrCode} alt="Access QR Code" className="relative z-10 mx-auto bg-white p-4 rounded-2xl shadow-2xl" />
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                             <Link to="/" className="inline-flex h-12 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 px-8 text-sm font-semibold text-white transition-all hover:bg-slate-700">
                                                  Return Home
                                             </Link>
                                             <button onClick={() => window.print()} className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-slate-950 transition-all hover:bg-slate-200">
                                                  Download PDF
                                             </button>
                                        </div>
                                   </div>
                              )}
                         </div>

                         {step === 1 && selectedTicket && (
                              <div className="lg:col-span-4 animate-in fade-in slide-in-from-right-8 duration-700">
                                   <div className="sticky top-8 space-y-4">
                                        <div className="rounded-2xl border border-white/5 bg-indigo-500/5 p-6 backdrop-blur-sm">
                                             <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Your Selection</h3>

                                             <div className="flex items-start gap-4 mb-8">
                                                  <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                                                       <selectedTicket.icon size={24} />
                                                  </div>
                                                  <div>
                                                       <div className="font-bold text-white text-lg">{selectedTicket.name}</div>
                                                       <div className="text-xs text-slate-500 mt-1">Full conference access</div>
                                                  </div>
                                             </div>

                                             <div className="space-y-4 pt-6 border-t border-white/5">
                                                  <div className="flex justify-between text-sm text-slate-400">
                                                       <span>Base Price</span>
                                                       <span>${selectedTicket.price.toFixed(2)}</span>
                                                  </div>
                                                  {selectedTicket.currentPrice < selectedTicket.price && (
                                                       <div className="flex justify-between text-sm text-emerald-400">
                                                            <span>Discount Applied</span>
                                                            <span>-${(selectedTicket.price - selectedTicket.currentPrice).toFixed(2)}</span>
                                                       </div>
                                                  )}
                                                  <div className="flex justify-between items-center pt-4 text-white">
                                                       <span className="text-sm font-medium">Total Amount</span>
                                                       <span className="text-2xl font-black">${selectedTicket.currentPrice.toFixed(2)}</span>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Promo Code Input */}
                                        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-sm">
                                             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3 ml-1">Promo Code</label>
                                             <div className="relative">
                                                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                                  <input
                                                       type="text"
                                                       placeholder="Enter code"
                                                       className="w-full h-11 bg-slate-950/50 border border-white/5 rounded-xl pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                                                       value={formData.promoCode}
                                                       onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                                                  />
                                             </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] text-slate-600 justify-center">
                                             <CreditCard size={12} />
                                             <span>Secure Encrypted Checkout</span>
                                        </div>
                                   </div>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}

function StepIndicator({ num, label, active, complete }) {
     return (
          <div className={`flex items-center gap-3 transition-colors ${active ? 'text-white' : 'text-slate-600'}`}>
               <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${complete ? 'bg-indigo-600 border-indigo-600 text-white' :
                    active ? 'border-indigo-500 text-indigo-400' : 'border-slate-800'
                    }`}>
                    {complete ? <CheckCircle2 size={14} /> : num}
               </div>
               <span className="text-sm font-semibold hidden sm:block">{label}</span>
          </div>
     );
}

function TicketCard({ ticket, onSelect }) {
     const Icon = ticket.icon;
     return (
          <button
               onClick={onSelect}
               className="group relative flex flex-col p-8 rounded-2xl border border-white/5 bg-slate-900/40 text-left transition-all hover:border-indigo-500/50 hover:bg-slate-900/80"
          >
               <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                    <Icon size={24} />
               </div>
               <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors">{ticket.name}</h3>
               <p className="text-xs font-medium text-slate-500 tracking-wide uppercase mb-8">{ticket.available} spots remaining</p>

               <div className="mt-auto pt-6 border-t border-white/5 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">${ticket.currentPrice}</span>
                    {ticket.currentPrice < ticket.price && (
                         <span className="text-sm text-slate-600 line-through">${ticket.price}</span>
                    )}
               </div>
          </button>
     );
}

function FormInput({ label, icon: Icon, ...props }) {
     return (
          <div className="space-y-2">
               <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
               <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                         <Icon size={18} />
                    </div>
                    <input
                         className="w-full h-12 bg-slate-950/50 border border-white/5 rounded-xl pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                         {...props}
                         onChange={e => props.onChange(e.target.value)}
                    />
               </div>
          </div>
     );
}

function ErrorMessage({ message }) {
     return (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
               <AlertCircle size={18} /> {message}
          </div>
     );
}