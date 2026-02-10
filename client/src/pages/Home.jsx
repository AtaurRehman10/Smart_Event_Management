import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

function AnimatedCounter({ end, label, suffix = '' }) {
     const [count, setCount] = useState(0);
     useEffect(() => {
          let start = 0;
          const duration = 2000;
          const step = Math.ceil(end / (duration / 16));
          const timer = setInterval(() => {
               start += step;
               if (start >= end) { setCount(end); clearInterval(timer); }
               else setCount(start);
          }, 16);
          return () => clearInterval(timer);
     }, [end]);
     return (
          <div className="text-center">
               <p className="text-3xl md:text-4xl font-bold gradient-text">{count.toLocaleString()}{suffix}</p>
               <p className="text-sm text-[var(--text-muted)] mt-1">{label}</p>
          </div>
     );
}

function FeatureCard({ icon, title, description, color, delay }) {
     return (
          <div
               className="gradient-border-card p-6 hover:scale-[1.03] transition-all duration-500 animate-slide-up group"
               style={{ animationDelay: delay }}
          >
               <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `linear-gradient(135deg, ${color}20, ${color}40)` }}
               >
                    <span className="text-2xl">{icon}</span>
               </div>
               <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
               <p className="text-sm text-[var(--text-muted)] leading-relaxed">{description}</p>
          </div>
     );
}

export default function Home() {
     const { user } = useAuth();

     return (
          <div className="min-h-screen relative overflow-hidden animated-gradient-bg">
               {/* Decorative Orbs */}
               <div className="orb orb-primary w-[600px] h-[600px] -top-[200px] -left-[200px] animate-float-slow" />
               <div className="orb orb-secondary w-[500px] h-[500px] -bottom-[150px] -right-[150px] animate-float" />
               <div className="orb orb-accent w-[300px] h-[300px] top-[40%] right-[10%] opacity-[0.04]" />

               {/* Floating geometric shapes */}
               <div className="absolute top-[15%] left-[8%] w-3 h-3 rounded-full bg-[var(--color-primary)] opacity-30 animate-float" style={{ animationDelay: '0s' }} />
               <div className="absolute top-[25%] right-[12%] w-2 h-2 rounded-full bg-[var(--color-secondary)] opacity-25 animate-float" style={{ animationDelay: '1s' }} />
               <div className="absolute top-[60%] left-[15%] w-4 h-4 rounded-sm bg-[var(--color-accent)] opacity-15 animate-float-slow rotate-45" style={{ animationDelay: '2s' }} />
               <div className="absolute top-[70%] right-[20%] w-3 h-3 rounded-full bg-[var(--color-primary-light)] opacity-20 animate-float" style={{ animationDelay: '0.5s' }} />
               <div className="absolute top-[45%] left-[45%] w-2 h-2 rounded-full bg-[var(--color-success)] opacity-20 animate-float-slow" style={{ animationDelay: '1.5s' }} />

               {/* Navigation */}
               <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center shadow-lg">
                              <Zap className="w-5 h-5 text-white" />
                         </div>
                         <span className="text-xl font-bold gradient-text">EventSphere</span>
                    </div>
                    <div className="flex items-center gap-3">
                         {user ? (
                              <Link to={user.role === 'Attendee' ? '/dashboard/attendee' : '/dashboard'} className="btn btn-primary">
                                   Dashboard →
                              </Link>
                         ) : (
                              <>
                                   <Link to="/login" className="btn btn-secondary">Sign In</Link>
                                   <Link to="/register" className="btn btn-primary">Get Started</Link>
                              </>
                         )}
                    </div>
               </nav>

               {/* Hero Section */}
               <div className="relative z-10 container mx-auto px-6 pt-16 pb-12 flex flex-col items-center justify-center text-center">
                    <div className="animate-slide-up">
                         <span className="badge badge-primary text-xs tracking-wide uppercase mb-6 inline-flex">
                              ✨ Next-Gen Event Platform
                         </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight animate-slide-up leading-[1.05]" style={{ animationDelay: '0.1s' }}>
                         <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 text-glow">
                              EventSphere
                         </span>
                         <br />
                         <span className="text-3xl md:text-5xl lg:text-6xl gradient-text">
                              The Future of Events
                         </span>
                    </h1>

                    <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
                         Experience the next generation of event management — interactive floor plans,
                         real-time networking, smart scheduling, and live engagement tools, all in one
                         beautifully crafted platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                         {user ? (
                              <Link to={user.role === 'Attendee' ? '/dashboard/attendee' : '/dashboard'} className="btn btn-primary px-8 py-3.5 text-base">
                                   Go to Dashboard →
                              </Link>
                         ) : (
                              <>
                                   <Link to="/register" className="btn btn-primary px-8 py-3.5 text-base">
                                        <Zap className="w-5 h-5" />
                                        Start Free
                                   </Link>
                                   <Link to="/login" className="btn btn-secondary px-8 py-3.5 text-base">
                                        Sign In
                                   </Link>
                              </>
                         )}
                    </div>
               </div>

               {/* Stats Section */}
               <div className="relative z-10 container mx-auto px-6 py-12">
                    <div className="glass-card-static p-8 grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                         <AnimatedCounter end={10000} label="Events Hosted" suffix="+" />
                         <AnimatedCounter end={50000} label="Attendees" suffix="+" />
                         <AnimatedCounter end={500} label="Organizations" suffix="+" />
                         <AnimatedCounter end={99} label="Satisfaction" suffix="%" />
                    </div>
               </div>

               {/* Feature Grid */}
               <div className="relative z-10 container mx-auto px-6 py-16">
                    <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                         <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
                              Everything You Need
                         </h2>
                         <p className="text-[var(--text-muted)] max-w-xl mx-auto">
                              Powerful features designed to make your events unforgettable
                         </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                         <FeatureCard
                              icon="🗺️"
                              title="Interactive Venue Maps"
                              description="Navigate venues with ease using dynamic SVG-based floor plans with real-time capacity tracking."
                              color="#6366f1"
                              delay="0.1s"
                         />
                         <FeatureCard
                              icon="🤝"
                              title="Smart Networking"
                              description="Connect with attendees and exchange digital business cards instantly at any event."
                              color="#06b6d4"
                              delay="0.15s"
                         />
                         <FeatureCard
                              icon="⚡"
                              title="Real-time Updates"
                              description="Live session capacity tracking, instant notifications, and real-time event updates."
                              color="#f59e0b"
                              delay="0.2s"
                         />
                         <FeatureCard
                              icon="📊"
                              title="Live Polling & Q&A"
                              description="Engage your audience with real-time polls, Q&A sessions, and interactive presentations."
                              color="#10b981"
                              delay="0.25s"
                         />
                         <FeatureCard
                              icon="🏷️"
                              title="Badge Designer"
                              description="Create stunning custom badges with our drag-and-drop designer and export to PDF."
                              color="#8b5cf6"
                              delay="0.3s"
                         />
                         <FeatureCard
                              icon="📱"
                              title="PWA Ready"
                              description="Works offline, installable on any device. Always accessible, even without an internet connection."
                              color="#ec4899"
                              delay="0.35s"
                         />
                    </div>
               </div>

               {/* Footer */}
               <footer className="relative z-10 border-t border-[var(--border-color)] mt-12">
                    <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                         <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                                   <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                   </svg>
                              </div>
                              <span className="text-sm font-semibold gradient-text">EventSphere</span>
                         </div>
                         <p className="text-sm text-[var(--text-muted)]">
                              © 2026 EventSphere. Smart Event Management & Networking Platform.
                         </p>
                    </div>
               </footer>
          </div>
     );
}
