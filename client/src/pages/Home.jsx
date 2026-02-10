import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
     Code2,
     LayoutGrid,
     Users,
     BellRing,
     BarChart3,
     IdCard,
     Smartphone,
     ArrowRight,
     PlayCircle,
     Terminal
} from 'lucide-react';

function AnimatedCounter({ end, label, suffix = '', duration = 1800 }) {
     const [count, setCount] = useState(0);

     useEffect(() => {
          let raf = 0;
          const start = performance.now();

          const tick = (now) => {
               const t = Math.min(1, (now - start) / duration);
               // smooth easeOutCubic
               const eased = 1 - Math.pow(1 - t, 3);
               setCount(Math.round(eased * end));
               if (t < 1) raf = requestAnimationFrame(tick);
          };

          raf = requestAnimationFrame(tick);
          return () => cancelAnimationFrame(raf);
     }, [end, duration]);

     return (
          <div className="text-center">
               <p className="text-3xl md:text-4xl font-bold tracking-tight gradient-text mb-1">
                    {count.toLocaleString()}
                    {suffix}
               </p>
               <p className="text-xs md:text-sm text-white/60 font-medium">{label}</p>
          </div>
     );
}

function FeatureCard({ icon: Icon, title, description, delay = '0s' }) {
     return (
          <div
               className="glass-card p-6 animate-slide-up group h-full"
               style={{ animationDelay: delay }}
          >
               <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white/[0.03] border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
               </div>
               <h3 className="text-lg font-semibold text-white mb-2 tracking-tight group-hover:text-indigo-200 transition-colors">
                    {title}
               </h3>
               <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {description}
               </p>
          </div>
     );
}

function PremiumBackdrop() {
     return (
          <>
               {/* Background */}
               <div className="absolute inset-0 -z-10 bg-[#0a0e1a]" />

               {/* Animated Gradient Background */}
               <div className="absolute inset-0 -z-10 opacity-40 animated-gradient-bg" />

               {/* Subtle grid pattern */}
               <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-20" />

               {/* Glow orbs */}
               <div className="absolute -z-10 top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] animate-float-slow" />
               <div className="absolute -z-10 bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[120px] animate-float-slow" style={{ animationDelay: '2s' }} />
               <div className="absolute -z-10 top-[40%] left-[50%] translate-x-[-50%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
          </>
     );
}

export default function Home() {


     return (
          <div className="min-h-screen relative overflow-hidden flex flex-col font-sans">
               <PremiumBackdrop />

               {/* Top Nav */}
               <nav className="relative z-20 w-full px-6">
                    <div className="flex items-center justify-between py-10  mx-auto">
                         <div className="flex items-center gap-3 group cursor-pointer">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:scale-105 transition-all duration-300">
                                   <Code2 className="w-6 h-6 text-indigo-400" />
                              </div>
                              <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-100 transition-colors">
                                   EventSphere
                              </span>
                         </div>

                         <div className="flex items-center gap-4">
                              <Link
                                   to="/login"
                                   className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                              >
                                   Login
                              </Link>
                              <Link
                                   to="/register"
                                   className="btn btn-primary"
                              >
                                   Register
                              </Link>
                         </div>
                    </div>
               </nav>

               {/* Hero */}
               <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 pt-12 md:pt-20 pb-20">
                    <div className="container max-w-7xl mx-auto text-center">
                         <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-medium text-indigo-300 animate-slide-up hover:bg-indigo-500/10 transition-colors cursor-default mb-8">
                              <Terminal className="w-3.5 h-3.5" />
                              <span>The Ultimate Developer Conference</span>
                         </div>

                         <h1
                              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white animate-slide-up leading-[1.1] mb-6"
                              style={{ animationDelay: '0.1s' }}
                         >
                              Build the
                              <span className="block gradient-text pb-2">
                                   Future of Tech
                              </span>
                         </h1>

                         <p
                              className="text-lg text-center md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-slide-up font-light mb-10"
                              style={{ animationDelay: '0.2s' }}
                         >
                              Join thousands of developers, innovators, and industry leaders for an immersive experience of learning, networking, and building the next generation of software.
                         </p>



                         {/* Hero Stats */}
                         <div
                              className="mt-20 mx-auto max-w-5xl glass-card p-8 animate-slide-up"
                              style={{ animationDelay: '0.4s' }}
                         >
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                   <AnimatedCounter end={5000} label="Developers" suffix="+" />
                                   <AnimatedCounter end={120} label="Speakers" suffix="+" />
                                   <AnimatedCounter end={45} label="Workshops" suffix="+" />
                                   <AnimatedCounter end={3} label="Days of Code" suffix="" />
                              </div>
                         </div>
                    </div>
               </main>

               {/* Features Section */}
               <section className="relative z-10 py-24 bg-gradient-to-b from-transparent to-[#0a0e1a]/80 mx-auto">
                    <div className="container  mx-auto px-6">
                         <div className="text-center mb-16 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                                   Why use EventSphere?
                              </h2>
                              <p className="text-slate-400  mx-auto text-lg">
                                   Experience a developer-focused event designed to inspire, educate, and connect.
                              </p>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              <FeatureCard
                                   icon={LayoutGrid}
                                   title="Interactive Sessions"
                                   description="Join deep-dive technical sessions led by industry experts and core maintainers."
                                   delay="0.10s"
                              />
                              <FeatureCard
                                   icon={Users}
                                   title="Global Networking"
                                   description="Connect with developers from around the world through smart matchmaking."
                                   delay="0.15s"
                              />
                              <FeatureCard
                                   icon={BellRing}
                                   title="Real-time Updates"
                                   description="Stay organized with a personalized schedule and instant session notifications."
                                   delay="0.20s"
                              />
                              <FeatureCard
                                   icon={BarChart3}
                                   title="Live Workshops"
                                   description="Hands-on coding workshops to learn new frameworks and tools efficiently."
                                   delay="0.25s"
                              />
                              <FeatureCard
                                   icon={IdCard}
                                   title="Career Fair"
                                   description="Meet top tech companies hiring for remote and on-site roles."
                                   delay="0.30s"
                              />
                              <FeatureCard
                                   icon={Smartphone}
                                   title="Hackathon"
                                   description="Participate in our 24-hour hackathon and win amazing prizes."
                                   delay="0.35s"
                              />
                         </div>
                    </div>
               </section>

               {/* Footer */}
               <footer className="relative z-10 border-t border-white/5 bg-[#0a0e1a]">
                    <div className="container max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                         <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                   <Code2 className="w-5 h-5 text-indigo-400" />
                              </div>
                              <span className="text-sm font-semibold text-slate-300">DevCon 2026</span>
                         </div>

                         <div className="flex items-center gap-6 text-sm text-slate-500">
                              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                              <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
                              <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
                         </div>

                         <p className="text-xs text-slate-600">
                              © 2026 DevCon. All rights reserved.
                         </p>
                    </div>
               </footer>
          </div>
     );
}