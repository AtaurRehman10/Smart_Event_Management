import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../index.css';
import {
     Zap,
     Mail,
     Lock,
     AlertCircle,
     ArrowRight,
     ShieldCheck,
     Loader2
} from 'lucide-react';

export default function Login() {
     const [form, setForm] = useState({ email: '', password: '' });
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     const { login } = useAuth();
     const navigate = useNavigate();

     const handleSubmit = async (e) => {
          e.preventDefault();
          setError('');
          setLoading(true);
          try {
               const data = await login(form);
               navigate(data.user.role === 'Attendee' ? '/dashboard/attendee' : '/dashboard');
          } catch (err) {
               setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-[#020617] text-slate-100 flex relative overflow-hidden font-sans">

               {/* Ambient Background Elements */}
               <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px] animate-float-slow" />
                    <div className="absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px] animate-float-slow" style={{ animationDelay: '2s' }} />
               </div>

               {/* Left Panel - Branding (Visible on Desktop) */}
               <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative z-10 border-r border-white/5">
                    <div className="max-w-md text-center animate-slide-up">
                         <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 shadow-[0_0_40px_rgba(79,70,229,0.15)] mb-8">
                              <Zap size={40} className="text-indigo-400" />
                         </div>
                         <h2 className="text-5xl font-extrabold tracking-tight mb-6 text-white">
                              Experience the <br />
                              <span className="gradient-text">Future of Events</span>
                         </h2>
                         <p className="text-slate-400 text-lg leading-relaxed mb-10">
                              Streamline your event management workflow and connect with your audience like never before.
                         </p>

                         {/* Feature badges */}
                         <div className="flex flex-wrap justify-center gap-3">
                              {['Smart Networking', 'Live Analytics', 'Interactive Maps'].map((feature, i) => (
                                   <span
                                        key={feature}
                                        className="px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-semibold text-indigo-300 tracking-wide animate-slide-up"
                                        style={{ animationDelay: `${0.1 * i}s` }}
                                   >
                                        {feature}
                                   </span>
                              ))}
                         </div>
                    </div>
               </div>

               {/* Right Panel - Form */}
               <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                    <div className="w-full max-w-md animate-scale-in">

                         {/* Mobile Header */}
                         <div className="text-center mb-10 lg:hidden">
                              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500/20 border border-indigo-500/30 mb-4">
                                   <Zap size={28} className="text-indigo-400" />
                              </div>
                              <h1 className="text-2xl font-bold tracking-tight text-white">DevCon</h1>
                         </div>

                         <div className="glass-card p-8 md:p-10 shadow-2xl border border-white/10">
                              <div className="mb-8 text-center">
                                   <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                                   <p className="text-slate-400 text-sm mt-3">Sign in to access your dashboard</p>
                              </div>

                              {error && (
                                   <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-slide-in">
                                        <AlertCircle size={16} className="shrink-0" />
                                        {error}
                                   </div>
                              )}

                              <form onSubmit={handleSubmit} className="space-y-5">
                                   {/* Email Input */}
                                   <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 ml-1">Email Address</label>
                                        <div className="relative group">
                                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                                                  <Mail size={18} />
                                             </div>
                                             <input
                                                  type="email"
                                                  required
                                                  placeholder="name@company.com"
                                                  className="input pl-12 bg-white/5 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white placeholder:text-slate-500"
                                                  value={form.email}
                                                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                                             />
                                        </div>
                                   </div>

                                   {/* Password Input */}
                                   <div className="space-y-1.5">
                                        <div className="flex items-center justify-between px-1">
                                             <label className="text-xs font-semibold text-slate-300">Password</label>
                                             <button type="button" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                                  Forgot password?
                                             </button>
                                        </div>
                                        <div className="relative group">
                                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                                                  <Lock size={18} />
                                             </div>
                                             <input
                                                  type="password"
                                                  required
                                                  placeholder="••••••••"
                                                  className="input pl-12 bg-white/5 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white placeholder:text-slate-500"
                                                  value={form.password}
                                                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                                             />
                                        </div>
                                   </div>

                                   {/* Remember Me */}
                                   <div className="flex items-center gap-3 px-1 pt-1">
                                        <input
                                             type="checkbox"
                                             id="remember"
                                             className="w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-indigo-500 focus:ring-indigo-500/20 focus:ring-offset-0"
                                        />
                                        <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer select-none hover:text-slate-300 transition-colors">
                                             Keep me signed in
                                        </label>
                                   </div>

                                   {/* Submit Button */}
                                   <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full justify-center mt-2 py-3"
                                   >
                                        {loading ? (
                                             <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                             <>Sign In <ArrowRight size={18} /></>
                                        )}
                                   </button>
                              </form>

                              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                   <p className="text-sm text-slate-500">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                                             Create now
                                        </Link>
                                   </p>
                              </div>
                         </div>

                         {/* Trust footer */}
                         <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold opacity-60">
                              <ShieldCheck size={14} />
                              <span>Secure Enterprise Access</span>
                         </div>
                    </div>
               </div>
          </div>
     );
}