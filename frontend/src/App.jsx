import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import InstallButton from './components/PWA/InstallButton';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './hooks/useToast';
import { useAuth } from './hooks/useAuth';
import PageLoader from './components/UI/PageLoader';
import ErrorBoundary from './components/UI/ErrorBoundary';

const Home = React.lazy(() => import('./pages/Home'));
const Services = React.lazy(() => import('./pages/Services'));
const ServiceDetails = React.lazy(() => import('./pages/ServiceDetails'));
const ServiceBooking = React.lazy(() => import('./pages/ServiceBooking'));
const Pets = React.lazy(() => import('./pages/Pets'));
const PetDetails = React.lazy(() => import('./pages/PetDetails'));
const Adoption = React.lazy(() => import('./pages/Adoption'));
const About = React.lazy(() => import('./pages/About'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Account = React.lazy(() => import('./pages/Account'));
const AdminPortal = React.lazy(() => import('./pages/AdminPortal'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AppContent() {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

  if (isAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 text-dark antialiased">
        <main className="flex-grow flex flex-col">
          <Suspense fallback={<PageLoader message="Loading admin panel…" />}>
            <Routes>
              <Route path="*" element={<AdminPortal />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-dark antialiased">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader message="Loading…" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service-details" element={<ServiceDetails />} />
            <Route path="/service-booking" element={<ServiceBooking />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pet-details" element={<PetDetails />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/admin" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <InstallButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

