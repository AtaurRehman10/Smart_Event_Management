import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, Lock, Building2, ArrowRight, Loader2, Mail } from 'lucide-react';

export default function Register() {
     const [form, setForm] = useState({
          name: '', email: '', password: '', confirmPassword: '',
          role: 'Attendee', organization: '', industry: '',
     });
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     const { register } = useAuth();
     const navigate = useNavigate();

     const handleSubmit = async (e) => {
          e.preventDefault();
          setError('');
          if (form.password !== form.confirmPassword) return setError('Passwords do not match');
          if (form.password.length < 6) return setError('Password must be at least 6 characters');

          setLoading(true);
          try {
               await register(form);
               navigate('/');
          } catch (err) {
               setError(err.response?.data?.message || 'Registration failed');
          } finally {
               setLoading(false);
          }
     };

     const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

     return (
          <div className="min-h-screen flex animated-gradient-bg relative overflow-hidden font-sans text-slate-100">
               {/* Decorative Background */}
               <div className="orb orb-primary w-[500px] h-[500px] -top-24 -left-24" />
               <div className="orb orb-secondary w-[400px] h-[400px] -bottom-24 -right-24" />

               {/* Left Panel - Branding */}
               <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative z-10 border-r border-white/5">
                    <div className="max-w-md text-center">
                         <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-8 shadow-xl">
                              <Building2 size={40} className="text-indigo-400" />
                         </div>
                         <h2 className="text-5xl font-extrabold tracking-tight mb-6">
                              Join the <br />
                              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Event Community</span>
                         </h2>
                         <p className="text-slate-400 text-lg leading-relaxed mb-10">
                              Start your journey with the world's most advanced event management platform.
                         </p>
                    </div>
               </div>

               {/* Right Panel - Form */}
               <div className="flex-1 flex items-center justify-center p-18 relative z-10 overflow-y-auto">
                    <div className="w-full max-w-xl py-10">
                         <div className="glass-card p-8 md:p-10 border border-white/10">
                              <div className="mb-8">
                                   <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                                   <p className="text-slate-400 text-sm mt-2">Join us and start managing events effortlessly.</p>
                              </div>

                              {error && (
                                   <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                                        {error}
                                   </div>
                              )}

                              <form onSubmit={handleSubmit} className="space-y-6">
                                   {/* Personal Info Section */}
                                   <section className="space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                             <User size={14} /> Personal Details
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <input type="text" className="input" placeholder="Full Name" value={form.name} onChange={update('name')} required />
                                             <input type="email" className="input" placeholder="Email Address" value={form.email} onChange={update('email')} required />
                                        </div>
                                   </section>

                                   {/* Security Section */}
                                   <section className="space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                             <Lock size={14} /> Security
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <input type="password" className="input" placeholder="Password" value={form.password} onChange={update('password')} required />
                                             <input type="password" className="input" placeholder="Confirm Password" value={form.confirmPassword} onChange={update('confirmPassword')} required />
                                        </div>
                                   </section>

                                   {/* Professional Section */}
                                   <section className="space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                             <Building2 size={14} /> Professional Info
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                             <select className="input" value={form.role} onChange={update('role')}>
                                                  <option value="Attendee">Attendee</option>
                                                  <option value="Organizer">Organizer</option>
                                                  <option value="Staff">Staff</option>
                                             </select>
                                             <input type="text" className="input" placeholder="Organization" value={form.organization} onChange={update('organization')} />
                                             <input type="text" className="input" placeholder="Industry" value={form.industry} onChange={update('industry')} />
                                        </div>
                                   </section>

                                   <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 mt-4">
                                        {loading ? <Loader2 className="animate-spin" /> : <>Get Started <ArrowRight size={20} /></>}
                                   </button>
                              </form>

                              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                   <p className="text-sm text-slate-500">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">Sign in</Link>
                                   </p>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}