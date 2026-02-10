import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

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
               navigate(data.user.role === 'Attendee' ? '/dashboard/attendee' : '/');
          } catch (err) {
               setError(err.response?.data?.message || 'Login failed');
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen flex animated-gradient-bg relative overflow-hidden">
               {/* Decorative Orbs */}
               <div className="orb orb-primary w-[500px] h-[500px] top-[-10%] left-[-10%]" />
               <div className="orb orb-secondary w-[400px] h-[400px] bottom-[-10%] right-[-10%]" />
               <div className="orb orb-accent w-[200px] h-[200px] top-[50%] left-[30%] opacity-[0.04]" />

               {/* Floating shapes */}
               <div className="absolute top-[20%] right-[15%] w-3 h-3 rounded-full bg-[var(--color-primary)] opacity-25 animate-float" />
               <div className="absolute bottom-[30%] left-[20%] w-2 h-2 rounded-full bg-[var(--color-secondary)] opacity-20 animate-float-slow" />
               <div className="absolute top-[40%] right-[40%] w-2 h-2 rounded-sm bg-[var(--color-accent)] opacity-15 rotate-45 animate-float" style={{ animationDelay: '1s' }} />

               {/* Left Panel - Branding */}
               <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative z-10">
                    <div className="max-w-md text-center animate-blur-in">
                         <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] mb-6 shadow-lg animate-float">
                              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                         </div>
                         <h2 className="text-4xl font-bold mb-4">
                              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Welcome to</span>
                              <br />
                              <span className="gradient-text text-5xl">EventSphere</span>
                         </h2>
                         <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                              The next generation of event management.<br />
                              Organize. Connect. Inspire.
                         </p>

                         {/* Feature pills */}
                         <div className="flex flex-wrap justify-center gap-3 mt-8">
                              {['Interactive Maps', 'Live Polls', 'Smart Badges', 'Real-time Updates'].map((f, i) => (
                                   <span key={f} className="badge badge-primary animate-slide-up" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                                        {f}
                                   </span>
                              ))}
                         </div>
                    </div>
               </div>

               {/* Right Panel - Form */}
               <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                    <div className="w-full max-w-md animate-scale-in">
                         {/* Mobile Logo */}
                         <div className="text-center mb-8 lg:hidden">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] mb-4 shadow-lg">
                                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                   </svg>
                              </div>
                              <h1 className="text-3xl font-bold gradient-text">EventSphere</h1>
                         </div>

                         {/* Card */}
                         <div className="glass-card p-8">
                              <div className="mb-6">
                                   <h2 className="text-2xl font-bold text-[var(--text-primary)]">Sign in</h2>
                                   <p className="text-[var(--text-muted)] mt-1">Welcome back! Enter your credentials</p>
                              </div>

                              {error && (
                                   <div className="mb-4 p-3.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm flex items-center gap-2.5 animate-scale-in" role="alert">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                   </div>
                              )}

                              <form onSubmit={handleSubmit} className="space-y-5">
                                   <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                             Email Address
                                        </label>
                                        <div className="relative">
                                             <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                             </svg>
                                             <input
                                                  id="email"
                                                  type="email"
                                                  className="input pl-10"
                                                  placeholder="you@example.com"
                                                  value={form.email}
                                                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                  required
                                                  autoFocus
                                             />
                                        </div>
                                   </div>

                                   <div>
                                        <div className="flex items-center justify-between mb-2">
                                             <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
                                                  Password
                                             </label>
                                             <button type="button" className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors">
                                                  Forgot password?
                                             </button>
                                        </div>
                                        <div className="relative">
                                             <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                             </svg>
                                             <input
                                                  id="password"
                                                  type="password"
                                                  className="input pl-10"
                                                  placeholder="••••••••"
                                                  value={form.password}
                                                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                                                  required
                                             />
                                        </div>
                                   </div>

                                   <div className="flex items-center gap-2">
                                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-elevated)] accent-[var(--color-primary)]" />
                                        <label htmlFor="remember" className="text-sm text-[var(--text-muted)]">Remember me</label>
                                   </div>

                                   <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                   >
                                        {loading ? (
                                             <>
                                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                  Signing in...
                                             </>
                                        ) : (
                                             <>
                                                  Sign In
                                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                  </svg>
                                             </>
                                        )}
                                   </button>
                              </form>

                              <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
                                   Don't have an account?{' '}
                                   <Link to="/register" className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] font-semibold transition-colors">
                                        Create account
                                   </Link>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}
