import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { EventProvider } from './context/EventContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';

// Layout
import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Dashboard
import OrganizerDashboard from './pages/dashboard/OrganizerDashboard.jsx';
import AttendeeDashboard from './pages/dashboard/AttendeeDashboard.jsx';

// Events
import EventList from './pages/events/EventList.jsx';
import EventCreate from './pages/events/EventCreate.jsx';
import EventDetail from './pages/events/EventDetail.jsx';

// Registration
import RegistrationForm from './pages/registration/RegistrationForm.jsx';

// Sessions
import SessionScheduler from './pages/sessions/SessionScheduler.jsx';
import LiveSession from './pages/sessions/LiveSession.jsx';

// Venue
// Venue
import VenueEditor from './pages/venue/VenueEditor.jsx';
import VenueViewer from './pages/venue/VenueViewer.jsx';

// Networking
import Networking from './pages/networking/Networking.jsx';

// Badges
import BadgeDesigner from './pages/badges/BadgeDesigner.jsx';

// Search
import Search from './pages/search/Search.jsx';

// Home
import Home from './pages/Home.jsx';

// Hooks
import { useAuth } from './hooks/useAuth.js';

function ProtectedRoute({ children, roles }) {
     const { user, loading } = useAuth();
     if (loading) return <LoadingScreen />;
     if (!user) return <Navigate to="/login" replace />;
     if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
     return children;
}

function LoadingScreen() {
     return (
          <div className="flex items-center justify-center min-h-screen">
               <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[var(--text-secondary)]">Loading...</p>
               </div>
          </div>
     );
}

import { useSpeech } from './hooks/useSpeech';
import { useGesture } from './hooks/useGesture';

function AppLayout({ children }) {
     const { isSupported } = useSpeech();
     const { enabled } = useGesture();

     return (
          <div className="flex min-h-screen">
               <Sidebar />
               <div className="flex-1 flex flex-col">
                    <Navbar />
                    <main className="flex-1 p-6">{children}</main>
               </div>
          </div>
     );
}

export default function App() {
     return (
          <Router>
               <AuthProvider>
                    <SocketProvider>
                         <EventProvider>
                              <Routes>
                                   {/* Public Routes */}
                                   <Route path="/" element={<Home />} />
                                   <Route path="/login" element={<Login />} />
                                   <Route path="/register" element={<Register />} />

                                   {/* Protected Routes */}
                                   <Route
                                        path="/dashboard"
                                        element={
                                             <ProtectedRoute>
                                                  <AppLayout><OrganizerDashboard /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/dashboard/attendee"
                                        element={
                                             <ProtectedRoute roles={['Attendee']}>
                                                  <AppLayout><AttendeeDashboard /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/events"
                                        element={
                                             <ProtectedRoute>
                                                  <AppLayout><EventList /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/events/create"
                                        element={
                                             <ProtectedRoute roles={['Organizer', 'SuperAdmin']}>
                                                  <AppLayout><EventCreate /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/events/:id"
                                        element={
                                             <ProtectedRoute>
                                                  <AppLayout><EventDetail /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/events/:eventId/register"
                                        element={
                                             <ProtectedRoute>
                                                  <AppLayout><RegistrationForm /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/events/:eventId/sessions"
                                        element={
                                             <ProtectedRoute roles={['Organizer', 'SuperAdmin', 'Staff']}>
                                                  <AppLayout><SessionScheduler /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/sessions/:sessionId/live"
                                        element={
                                             <ProtectedRoute>
                                                  <AppLayout><LiveSession /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/events/:eventId/venue/edit"
                                        element={
                                             <ProtectedRoute roles={['Organizer', 'SuperAdmin']}>
                                                  <AppLayout><VenueEditor /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/events/:eventId/venue"
                                        element={
                                             <ProtectedRoute>
                                                  <AppLayout><VenueViewer /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/networking"
                                        element={
                                             <ProtectedRoute>
                                                  <AppLayout><Networking /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/badges"
                                        element={
                                             <ProtectedRoute roles={['Organizer', 'SuperAdmin']}>
                                                  <AppLayout><BadgeDesigner /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />
                                   <Route
                                        path="/search"
                                        element={
                                             <ProtectedRoute>
                                                  <AppLayout><Search /></AppLayout>
                                             </ProtectedRoute>
                                        }
                                   />

                                   {/* Catch all */}
                                   <Route path="*" element={<Navigate to="/" replace />} />
                              </Routes>
                         </EventProvider>
                    </SocketProvider>
               </AuthProvider>
          </Router>
     );
}
