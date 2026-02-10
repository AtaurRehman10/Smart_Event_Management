import { useState } from 'react';
import { useParams } from 'react-router-dom';
// import { registrationApi } from '../../api/registrationApi'; // Kept for your logic

export default function RegistrationForm() {
     const { eventId } = useParams();
     const [step, setStep] = useState(0);
     const [selectedTicket, setSelectedTicket] = useState(null);
     const [formData, setFormData] = useState({ name: '', email: '', company: '', title: '' });
     const [loading, setLoading] = useState(false);
     const [success, setSuccess] = useState(null);
     const [error, setError] = useState('');

     const tickets = [
          { _id: '1', name: 'General Admission', type: 'General', price: 99, currentPrice: 79, available: 45 },
          { _id: '2', name: 'VIP Pass', type: 'VIP', price: 299, currentPrice: 249, available: 12 },
          { _id: '3', name: 'Workshop Bundle', type: 'Workshop', price: 149, currentPrice: 149, available: 30 },
     ];

     const handleRegister = async () => {
          setLoading(true);
          setError('');
          try {
               // Simulated API call
               // const res = await registrationApi.register({ eventId, ticketId: selectedTicket._id, formResponses: formData });
               // setSuccess(res.data.registration);

               // Mocking success for demonstration:
               setTimeout(() => {
                    setSuccess({ qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example' });
                    setStep(2);
                    setLoading(false);
               }, 1500);
          } catch (err) {
               setError(err.response?.data?.message || 'Registration failed');
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
               <div className="max-w-4xl mx-auto animate-fade-in">

                    {/* Progress Stepper */}
                    {step < 2 && (
                         <div className="mb-12 text-center">
                              <h1 className="text-4xl font-black tracking-tight mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                   Secure Your Spot
                              </h1>
                              <div className="flex items-center justify-center gap-4">
                                   <StepIndicator num={1} label="Tickets" active={step >= 0} complete={step > 0} />
                                   <div className="w-16 h-[2px] bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: step >= 1 ? '100%' : '0%' }} />
                                   </div>
                                   <StepIndicator num={2} label="Checkout" active={step >= 1} complete={step > 1} />
                              </div>
                         </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                         <div className={step === 1 ? "lg:col-span-8" : "lg:col-span-12"}>

                              {/* Step 0: Ticket Selection */}
                              {step === 0 && (
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
                                        {tickets.map((ticket, idx) => (
                                             <TicketCard
                                                  key={ticket._id}
                                                  ticket={ticket}
                                                  delay={idx * 0.1}
                                                  onSelect={() => { setSelectedTicket(ticket); setStep(1); }}
                                             />
                                        ))}
                                   </div>
                              )}

                              {/* Step 1: Form */}
                              {step === 1 && selectedTicket && (
                                   <div className="space-y-6 animate-slide-left">
                                        <div className="glass-card p-8">
                                             <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                  <span className="w-2 h-8 bg-indigo-500 rounded-full" />
                                                  Attendee Details
                                             </h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                  <FormInput label="Full Name" placeholder="John Doe" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                                                  <FormInput label="Email Address" type="email" placeholder="john@example.com" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                                                  <FormInput label="Company" placeholder="Acme Inc." value={formData.company} onChange={v => setFormData({ ...formData, company: v })} />
                                                  <FormInput label="Job Title" placeholder="Developer" value={formData.title} onChange={v => setFormData({ ...formData, title: v })} />
                                             </div>
                                        </div>

                                        {error && <ErrorMessage message={error} />}

                                        <div className="flex gap-4">
                                             <button onClick={() => setStep(0)} className="btn btn-secondary flex-1">Back</button>
                                             <button
                                                  onClick={handleRegister}
                                                  disabled={loading || !formData.name || !formData.email}
                                                  className="btn btn-primary flex-[2] text-lg"
                                             >
                                                  {loading ? "Processing..." : `Register • $${selectedTicket.currentPrice}`}
                                             </button>
                                        </div>
                                   </div>
                              )}

                              {/* Step 2: Success */}
                              {step === 2 && success && (
                                   <div className="glass-card p-12 text-center animate-scale-in border-green-500/20">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                             <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                             </svg>
                                        </div>
                                        <h2 className="text-3xl font-bold mb-2">You're All Set!</h2>
                                        <p className="text-slate-400 mb-8">Confirmation sent to <span className="text-white font-medium">{formData.email}</span></p>
                                        <img src={success.qrCode} alt="QR" className="mx-auto bg-white p-3 rounded-xl mb-8 shadow-2xl" />
                                        <button className="btn btn-secondary mx-auto" onClick={() => window.location.reload()}>Book Another</button>
                                   </div>
                              )}
                         </div>

                         {/* Sidebar Summary */}
                         {step === 1 && selectedTicket && (
                              <div className="lg:col-span-4 animate-fade-in">
                                   <div className="sticky top-8 space-y-4">
                                        <div className="glass-card p-6 border-indigo-500/20 bg-indigo-500/5">
                                             <h3 className="font-bold text-slate-300 uppercase tracking-widest text-xs mb-4">Order Summary</h3>
                                             <div className="flex gap-3 mb-6">
                                                  <div className="text-2xl">{selectedTicket.type === 'VIP' ? '👑' : '🎟️'}</div>
                                                  <div>
                                                       <div className="font-bold">{selectedTicket.name}</div>
                                                       <div className="text-xs text-slate-400">Full Access Pass</div>
                                                  </div>
                                             </div>
                                             <div className="space-y-2 text-sm border-t border-slate-800 pt-4">
                                                  <div className="flex justify-between">
                                                       <span className="text-slate-400">Price</span>
                                                       <span>${selectedTicket.price}</span>
                                                  </div>
                                                  {selectedTicket.currentPrice < selectedTicket.price && (
                                                       <div className="flex justify-between text-green-400">
                                                            <span>Discount</span>
                                                            <span>-${selectedTicket.price - selectedTicket.currentPrice}</span>
                                                       </div>
                                                  )}
                                                  <div className="flex justify-between font-bold text-lg pt-2 text-white">
                                                       <span>Total</span>
                                                       <span>${selectedTicket.currentPrice}</span>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}

/* Sub-components for cleaner code */
function StepIndicator({ num, label, active, complete }) {
     return (
          <div className={`flex items-center gap-2 ${active ? 'text-indigo-400' : 'text-slate-600'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${active ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>
                    {complete ? '✓' : num}
               </div>
               <span className="font-medium hidden sm:block">{label}</span>
          </div>
     );
}

function TicketCard({ ticket, onSelect, delay }) {
     return (
          <button
               onClick={onSelect}
               style={{ animationDelay: `${delay}s` }}
               className="group relative flex flex-col p-6 glass-card hover:border-indigo-500/50 transition-all text-left"
          >
               <div className="text-3xl mb-4">{ticket.type === 'VIP' ? '👑' : '🎟️'}</div>
               <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-400 transition-colors">{ticket.name}</h3>
               <p className="text-sm text-slate-500 mb-6">{ticket.available} spots left</p>
               <div className="mt-auto pt-4 border-t border-slate-800 flex items-baseline gap-2">
                    <span className="text-2xl font-black">${ticket.currentPrice}</span>
                    {ticket.currentPrice < ticket.price && (
                         <span className="text-sm text-slate-600 line-through">${ticket.price}</span>
                    )}
               </div>
          </button>
     );
}

function FormInput({ label, ...props }) {
     return (
          <div className="space-y-1.5">
               <label className="text-sm font-semibold text-slate-400 ml-1">{label}</label>
               <input className="input" {...props} onChange={e => props.onChange(e.target.value)} />
          </div>
     );
}

function ErrorMessage({ message }) {
     return (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
               <span className="text-xl">⚠️</span> {message}
          </div>
     );
}