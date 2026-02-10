import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';

const steps = ['Basic Info', 'Location & Dates', 'Tickets', 'Custom Fields', 'Review'];

export default function EventCreate() {
     const [step, setStep] = useState(0);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');
     const navigate = useNavigate();

     const [form, setForm] = useState({
          title: '', description: '', category: '', tags: '',
          startDate: '', endDate: '', timezone: 'UTC',
          locationName: '', address: '', city: '', country: '',
          maxAttendees: '', registrationDeadline: '',
          tickets: [{ name: 'General Admission', type: 'General', price: 0, quantity: 100, earlyBirdPrice: '', earlyBirdDeadline: '' }],
          customFields: [],
     });

     const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

     const addTicket = () => {
          setForm({ ...form, tickets: [...form.tickets, { name: '', type: 'General', price: 0, quantity: 50, earlyBirdPrice: '', earlyBirdDeadline: '' }] });
     };

     const updateTicket = (index, field, value) => {
          const tickets = [...form.tickets];
          tickets[index][field] = value;
          setForm({ ...form, tickets });
     };

     const removeTicket = (index) => {
          setForm({ ...form, tickets: form.tickets.filter((_, i) => i !== index) });
     };

     const addCustomField = () => {
          setForm({ ...form, customFields: [...form.customFields, { label: '', type: 'text', required: false, options: [] }] });
     };

     const handleSubmit = async () => {
          setError('');
          setLoading(true);
          try {
               const eventData = {
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                    startDate: form.startDate,
                    endDate: form.endDate,
                    timezone: form.timezone,
                    location: { name: form.locationName, address: form.address, city: form.city, country: form.country },
                    maxAttendees: Number(form.maxAttendees) || undefined,
                    registrationDeadline: form.registrationDeadline || undefined,
                    customFields: form.customFields,
               };
               const res = await eventApi.create(eventData);
               navigate(`/events/${res.data.event._id}`);
          } catch (err) {
               setError(err.response?.data?.message || 'Failed to create event');
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="max-w-3xl mx-auto p-6 animate-fade-in">
               <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create Event</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Set up your event in a few simple steps</p>
               </div>

               {/* Step Indicator with Connected Line */}
               <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
                    {steps.map((s, i) => (
                         <div key={s} className="flex items-center">
                              <button
                                   onClick={() => setStep(i)}
                                   className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all duration-200 ${i === step
                                        ? 'bg-[var(--color-primary)] text-white shadow-[0_2px_12px_rgba(99,102,241,0.3)]'
                                        : i < step
                                             ? 'bg-green-500/10 text-green-400 hover:bg-green-500/15'
                                             : 'bg-[var(--bg-elevated)]/60 text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                                        }`}
                              >
                                   <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? 'bg-green-500/20' : i === step ? 'bg-white/20' : 'border border-[var(--border-color)]'}`}>
                                        {i < step ? '✓' : i + 1}
                                   </span>
                                   <span className="hidden sm:inline">{s}</span>
                              </button>
                              {i < steps.length - 1 && (
                                   <div className={`w-6 h-0.5 mx-1 rounded transition-colors ${i < step ? 'bg-green-400/40' : 'bg-[var(--border-color)]'}`} />
                              )}
                         </div>
                    ))}
               </div>

               {error && (
                    <div className="mb-6 p-3.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm flex items-center gap-2.5 animate-scale-in">
                         <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         {error}
                    </div>
               )}

               <div className="glass-card p-6">
                    {/* Step 0: Basic Info */}
                    {step === 0 && (
                         <div className="space-y-4">
                              <div>
                                   <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Event Title *</label>
                                   <input className="input" placeholder="Tech Conference 2026" value={form.title} onChange={update('title')} required />
                              </div>
                              <div>
                                   <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Description</label>
                                   <textarea className="input min-h-[120px] resize-y" placeholder="Describe your event..." value={form.description} onChange={update('description')} />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Category</label>
                                        <select className="input" value={form.category} onChange={update('category')}>
                                             <option value="">Select...</option>
                                             <option value="Technology">Technology</option>
                                             <option value="Business">Business</option>
                                             <option value="Design">Design</option>
                                             <option value="Marketing">Marketing</option>
                                             <option value="Science">Science</option>
                                             <option value="Education">Education</option>
                                        </select>
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Tags</label>
                                        <input className="input" placeholder="AI, Cloud, DevOps" value={form.tags} onChange={update('tags')} />
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* Step 1: Location & Dates */}
                    {step === 1 && (
                         <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Start Date *</label>
                                        <input type="datetime-local" className="input" value={form.startDate} onChange={update('startDate')} required />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">End Date *</label>
                                        <input type="datetime-local" className="input" value={form.endDate} onChange={update('endDate')} required />
                                   </div>
                              </div>
                              <div>
                                   <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Venue Name</label>
                                   <input className="input" placeholder="Convention Center" value={form.locationName} onChange={update('locationName')} />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">City</label>
                                        <input className="input" placeholder="San Francisco" value={form.city} onChange={update('city')} />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Country</label>
                                        <input className="input" placeholder="USA" value={form.country} onChange={update('country')} />
                                   </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Max Attendees</label>
                                        <input type="number" className="input" placeholder="500" value={form.maxAttendees} onChange={update('maxAttendees')} />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Registration Deadline</label>
                                        <input type="datetime-local" className="input" value={form.registrationDeadline} onChange={update('registrationDeadline')} />
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* Step 2: Tickets */}
                    {step === 2 && (
                         <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                   <h3 className="font-medium text-[var(--text-primary)]">Ticket Types</h3>
                                   <button onClick={addTicket} className="btn btn-secondary text-sm">+ Add Ticket</button>
                              </div>
                              {form.tickets.map((ticket, i) => (
                                   <div key={i} className="p-4 rounded-lg bg-[var(--bg-elevated)] space-y-3">
                                        <div className="flex items-center justify-between">
                                             <span className="text-sm font-medium text-[var(--text-secondary)]">Ticket #{i + 1}</span>
                                             {form.tickets.length > 1 && (
                                                  <button onClick={() => removeTicket(i)} className="text-red-400 text-sm hover:text-red-300">Remove</button>
                                             )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                             <input className="input" placeholder="Ticket name" value={ticket.name} onChange={e => updateTicket(i, 'name', e.target.value)} />
                                             <select className="input" value={ticket.type} onChange={e => updateTicket(i, 'type', e.target.value)}>
                                                  <option value="General">General</option>
                                                  <option value="VIP">VIP</option>
                                                  <option value="Workshop">Workshop</option>
                                                  <option value="Student">Student</option>
                                                  <option value="Speaker">Speaker</option>
                                             </select>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                             <div>
                                                  <label className="block text-xs text-[var(--text-muted)] mb-1">Price ($)</label>
                                                  <input type="number" className="input" value={ticket.price} onChange={e => updateTicket(i, 'price', e.target.value)} min="0" />
                                             </div>
                                             <div>
                                                  <label className="block text-xs text-[var(--text-muted)] mb-1">Quantity</label>
                                                  <input type="number" className="input" value={ticket.quantity} onChange={e => updateTicket(i, 'quantity', e.target.value)} min="1" />
                                             </div>
                                             <div>
                                                  <label className="block text-xs text-[var(--text-muted)] mb-1">Early Bird ($)</label>
                                                  <input type="number" className="input" placeholder="Optional" value={ticket.earlyBirdPrice} onChange={e => updateTicket(i, 'earlyBirdPrice', e.target.value)} />
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}

                    {/* Step 3: Custom Fields */}
                    {step === 3 && (
                         <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                   <h3 className="font-medium text-[var(--text-primary)]">Custom Registration Fields</h3>
                                   <button onClick={addCustomField} className="btn btn-secondary text-sm">+ Add Field</button>
                              </div>
                              {form.customFields.length === 0 ? (
                                   <p className="text-[var(--text-muted)] text-sm py-6 text-center">No custom fields added. These appear in the registration form.</p>
                              ) : form.customFields.map((field, i) => (
                                   <div key={i} className="p-4 rounded-lg bg-[var(--bg-elevated)] grid grid-cols-3 gap-3">
                                        <input className="input" placeholder="Field label" value={field.label} onChange={e => {
                                             const fields = [...form.customFields];
                                             fields[i].label = e.target.value;
                                             setForm({ ...form, customFields: fields });
                                        }} />
                                        <select className="input" value={field.type} onChange={e => {
                                             const fields = [...form.customFields];
                                             fields[i].type = e.target.value;
                                             setForm({ ...form, customFields: fields });
                                        }}>
                                             <option value="text">Text</option>
                                             <option value="email">Email</option>
                                             <option value="number">Number</option>
                                             <option value="textarea">Textarea</option>
                                             <option value="select">Dropdown</option>
                                             <option value="checkbox">Checkbox</option>
                                        </select>
                                        <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                                             <input type="checkbox" checked={field.required} onChange={e => {
                                                  const fields = [...form.customFields];
                                                  fields[i].required = e.target.checked;
                                                  setForm({ ...form, customFields: fields });
                                             }} />
                                             Required
                                        </label>
                                   </div>
                              ))}
                         </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                         <div className="space-y-4">
                              <h3 className="font-medium text-[var(--text-primary)]">Review & Publish</h3>
                              <div className="space-y-2 text-sm">
                                   <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
                                        <span className="text-[var(--text-muted)]">Title</span>
                                        <span className="text-[var(--text-primary)] font-medium">{form.title || '—'}</span>
                                   </div>
                                   <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
                                        <span className="text-[var(--text-muted)]">Dates</span>
                                        <span className="text-[var(--text-primary)]">{form.startDate ? new Date(form.startDate).toLocaleDateString() : '—'} → {form.endDate ? new Date(form.endDate).toLocaleDateString() : '—'}</span>
                                   </div>
                                   <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
                                        <span className="text-[var(--text-muted)]">Location</span>
                                        <span className="text-[var(--text-primary)]">{form.city || '—'}</span>
                                   </div>
                                   <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
                                        <span className="text-[var(--text-muted)]">Tickets</span>
                                        <span className="text-[var(--text-primary)]">{form.tickets.length} type(s)</span>
                                   </div>
                                   <div className="flex justify-between py-2">
                                        <span className="text-[var(--text-muted)]">Custom Fields</span>
                                        <span className="text-[var(--text-primary)]">{form.customFields.length}</span>
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-[var(--border-color)]">
                         <button
                              onClick={() => setStep(s => s - 1)}
                              disabled={step === 0}
                              className="btn btn-secondary disabled:opacity-30"
                         >
                              ← Back
                         </button>
                         {step < steps.length - 1 ? (
                              <button onClick={() => setStep(s => s + 1)} className="btn btn-primary">
                                   Next →
                              </button>
                         ) : (
                              <button onClick={handleSubmit} disabled={loading} className="btn btn-primary disabled:opacity-50">
                                   {loading ? 'Creating...' : '🚀 Create Event'}
                              </button>
                         )}
                    </div>
               </div>
          </div>
     );
}
