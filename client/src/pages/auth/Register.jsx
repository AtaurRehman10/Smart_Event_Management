import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const sections = [
     { title: 'Personal Info', icon: '👤' },
     { title: 'Security', icon: '🔒' },
     { title: 'Profile', icon: '🏢' },
];

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

          if (form.password !== form.confirmPassword) {
               return setError('Passwords do not match');
          }
          if (form.password.length < 6) {
               return setError('Password must be at least 6 characters');
          }

          setLoading(true);
          try {
               await register({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                    organization: form.organization,
                    industry: form.industry,
               });
               navigate('/');
          } catch (err) {
               setError(err.response?.data?.message || 'Registration failed');
          } finally {
               setLoading(false);
          }
     };

     const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

     return (
          <div className="min-h-screen flex animated-gradient-bg relative overflow-hidden">
               {/* Decorative Orbs */}
               <div className="orb orb-secondary w-[400px] h-[400px] top-[-10%] right-[-10%]" />
               <div className="orb orb-primary w-[350px] h-[350px] bottom-[-10%] left-[-5%]" />
               <div className="orb orb-accent w-[200px] h-[200px] top-[40%] right-[25%] opacity-[0.04]" />

               {/* Floating shapes */}
               <div className="absolute top-[15%] left-[10%] w-3 h-3 rounded-full bg-[var(--color-secondary)] opacity-25 animate-float" />
               <div className="absolute bottom-[20%] right-[15%] w-2 h-2 rounded-full bg-[var(--color-primary)] opacity-20 animate-float-slow" />

               {/* Left Panel */}
               <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative z-10">
                    <div className="max-w-md text-center animate-blur-in">
                         <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] mb-6 shadow-lg animate-float">
                              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                         </div>
                         <h2 className="text-4xl font-bold mb-4">
                              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Join</span>
                              <br />
                              <span className="gradient-text text-5xl">EventSphere</span>
                         </h2>
                         <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                              Create your account and start managing<br />
                              world-class events today.
                         </p>

                         {/* Steps preview */}
                         <div className="mt-10 space-y-4 text-left">
                              {sections.map((s, i) => (
                                   <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-slide-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                                        <span className="text-xl">{s.icon}</span>
                                        <div>
                                             <p className="text-sm font-medium text-[var(--text-primary)]">Step {i + 1}: {s.title}</p>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>

               {/* Right Panel - Form */}
               <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                    <div className="w-full max-w-lg animate-scale-in">
                         {/* Mobile Logo */}
                         <div className="text-center mb-6 lg:hidden">
                              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] mb-3 shadow-lg">
                                   <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                   </svg>
                              </div>
                              <h1 className="text-2xl font-bold gradient-text">Join EventSphere</h1>
                              <p className="text-[var(--text-muted)] text-sm mt-1">Create your account to get started</p>
                         </div>

                         <div className="glass-card p-8">
                              <div className="mb-6 hidden lg:block">
                                   <h2 className="text-2xl font-bold text-[var(--text-primary)]">Create Account</h2>
                                   <p className="text-[var(--text-muted)] mt-1">Fill in your details below</p>
                              </div>

                              {error && (
                                   <div className="mb-4 p-3.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm flex items-center gap-2.5 animate-scale-in" role="alert">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                   </div>
                              )}

                              <form onSubmit={handleSubmit} className="space-y-4">
                                   {/* Personal Info Section */}
                                   <div className="pb-3 mb-1 border-b border-[var(--border-color)]">
                                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                                             <span>👤</span> Personal Info
                                        </p>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
                                             <input id="name" type="text" className="input" placeholder="John Doe" value={form.name} onChange={update('name')} required autoFocus />
                                        </div>
                                        <div>
                                             <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
                                             <input id="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
                                        </div>
                                   </div>

                                   {/* Security Section */}
                                   <div className="pb-3 mb-1 border-b border-[var(--border-color)] pt-2">
                                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                                             <span>🔒</span> Security
                                        </p>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
                                             <input id="password" type="password" className="input" placeholder="Min. 6 characters" value={form.password} onChange={update('password')} required />
                                        </div>
                                        <div>
                                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Confirm Password</label>
                                             <input id="confirmPassword" type="password" className="input" placeholder="••••••••" value={form.confirmPassword} onChange={update('confirmPassword')} required />
                                        </div>
                                   </div>

                                   {/* Profile Section */}
                                   <div className="pb-3 mb-1 border-b border-[var(--border-color)] pt-2">
                                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                                             <span>🏢</span> Profile
                                        </p>
                                   </div>
                                   <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">I am a(n)</label>
                                        <select id="role" className="input" value={form.role} onChange={update('role')}>
                                             <option value="Attendee">Attendee</option>
                                             <option value="Organizer">Event Organizer</option>
                                             <option value="Staff">Event Staff</option>
                                        </select>
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                             <label htmlFor="organization" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Organization</label>
                                             <input id="organization" type="text" className="input" placeholder="Company name" value={form.organization} onChange={update('organization')} />
                                        </div>
                                        <div>
                                             <label htmlFor="industry" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Industry</label>
                                             <input id="industry" type="text" className="input" placeholder="e.g. Technology" value={form.industry} onChange={update('industry')} />
                                        </div>
                                   </div>

                                   <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full justify-center py-3 text-base mt-3 disabled:opacity-50"
                                   >
                                        {loading ? (
                                             <>
                                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                  Creating account...
                                             </>
                                        ) : (
                                             <>
                                                  Create Account
                                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                  </svg>
                                             </>
                                        )}
                                   </button>
                              </form>

                              <div className="mt-5 text-center text-sm text-[var(--text-muted)]">
                                   Already have an account?{' '}
                                   <Link to="/login" className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] font-semibold transition-colors">
                                        Sign in
                                   </Link>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}
