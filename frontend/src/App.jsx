import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import InstallButton from './components/PWA/InstallButton';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './hooks/useToast';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import ServiceBooking from './pages/ServiceBooking';
import Pets from './pages/Pets';
import PetDetails from './pages/PetDetails';
import Adoption from './pages/Adoption';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import AdminPortal from './pages/AdminPortal';
import NotFound from './pages/NotFound';

import { useAuth } from './hooks/useAuth';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
          <Routes>
            <Route path="*" element={<AdminPortal />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-dark antialiased">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* PWA Prompts */}
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
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
