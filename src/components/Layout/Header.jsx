import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../../utils/storage';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuth = () => {
    setUser(getCurrentUser());
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    window.dispatchEvent(new Event('authChange'));
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <header className="relative sticky top-0 z-10">
      {/* Top Bar */}
      <div className="hidden lg:block bg-dark py-2 text-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 hover:text-primary transition-all duration-300"
              >
                <i className="fas fa-phone"></i>
                (555) 123-4567
              </a>
              <a
                href="mailto:info@petcarepro.com"
                className="flex items-center gap-2 hover:text-primary transition-all duration-300"
              >
                <i className="fa-solid fa-envelope"></i>
                info@petcarepro.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition duration-300"
              >
                <i className="fab fa-facebook-f text-base"></i>
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition duration-300"
              >
                <i className="fab fa-x-twitter text-base"></i>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition duration-300"
              >
                <i className="fab fa-instagram text-base"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="md:container w-full mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="logo-col lg:max-w-[150px] max-w-[120px] w-full">
              <h1>
                <Link to="/" onClick={closeMobileMenu}>
                  <img src="/assets/images/logo.png" alt="logo" loading="lazy" />
                </Link>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-medium hover:text-primary transition duration-300 flex items-center ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`
                }
              >
                <span>Home</span>
              </NavLink>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `font-medium hover:text-primary transition duration-300 flex items-center ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`
                }
              >
                <span>Services</span>
              </NavLink>
              <NavLink
                to="/pricing"
                className={({ isActive }) =>
                  `font-medium hover:text-primary transition duration-300 flex items-center ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`
                }
              >
                <span>Pricing</span>
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `font-medium hover:text-primary transition duration-300 flex items-center ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`
                }
              >
                <span>About</span>
              </NavLink>
              <NavLink
                to="/faq"
                className={({ isActive }) =>
                  `font-medium hover:text-primary transition duration-300 flex items-center ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`
                }
              >
                <span>FAQ</span>
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `font-medium hover:text-primary transition duration-300 flex items-center ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`
                }
              >
                <span>Contact</span>
              </NavLink>

              {/* Dynamic Auth Buttons */}
              <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
                {user ? (
                  <>
                    <NavLink
                      to="/account"
                      className={({ isActive }) =>
                        `font-medium hover:text-primary transition duration-300 flex items-center gap-1.5 ${
                          isActive ? 'text-primary' : 'text-secondary'
                        }`
                      }
                    >
                      <i className="far fa-user-circle text-lg"></i>
                      <span>Dashboard</span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-red-500 font-semibold text-sm transition duration-200 cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="font-semibold text-sm text-secondary hover:text-primary transition duration-200">
                      Login
                    </Link>
                    <Link to="/register" className="px-4 py-2 bg-primary text-white hover:bg-dark rounded-full font-semibold transition text-xs shadow-md">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white h-full w-full max-w-sm ms-auto transform transition-transform duration-300 ease-in-out p-4 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <div className="logo-col max-w-[100px] w-full">
                  <Link to="/" onClick={closeMobileMenu}>
                    <img src="/assets/images/logo.png" alt="logo" loading="lazy" />
                  </Link>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-500 hover:text-primary transition-all duration-300"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <nav className="space-y-4">
                <NavLink
                  to="/"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block text-base font-medium hover:text-primary transition-all duration-300 ${
                      isActive ? 'text-primary' : 'text-dark'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/services"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block text-base font-medium hover:text-primary transition-all duration-300 ${
                      isActive ? 'text-primary' : 'text-dark'
                    }`
                  }
                >
                  Services
                </NavLink>
                <NavLink
                  to="/pricing"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block text-base font-medium hover:text-primary transition-all duration-300 ${
                      isActive ? 'text-primary' : 'text-dark'
                    }`
                  }
                >
                  Pricing
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block text-base font-medium hover:text-primary transition-all duration-300 ${
                      isActive ? 'text-primary' : 'text-dark'
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/faq"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block text-base font-medium hover:text-primary transition-all duration-300 ${
                      isActive ? 'text-primary' : 'text-dark'
                    }`
                  }
                >
                  FAQ
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block text-base font-medium hover:text-primary transition-all duration-300 ${
                      isActive ? 'text-primary' : 'text-dark'
                    }`
                  }
                >
                  Contact
                </NavLink>

                {/* Dynamic Mobile Auth buttons */}
                <div className="border-t pt-4 space-y-3">
                  {user ? (
                    <>
                      <NavLink
                        to="/account"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block text-base font-medium hover:text-primary transition-all duration-300 ${
                            isActive ? 'text-primary' : 'text-dark'
                          }`
                        }
                      >
                        Dashboard Profile
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full text-start text-base font-medium text-red-500 hover:text-red-600 transition-all duration-300 cursor-pointer"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-4">
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="flex-1 text-center py-2.5 bg-gray-100 text-gray-700 font-bold rounded-full text-sm"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="flex-1 text-center py-2.5 bg-primary text-white font-bold rounded-full text-sm shadow-md"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            <div className="mt-8">
              {/* Mobile Contact Info */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-600 mb-4">CONTACT INFO</h4>
                <div className="space-y-3">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center text-gray-600 hover:text-primary duration-300"
                  >
                    <i className="fas fa-phone text-base me-3 text-primary"></i>
                    (555) 123-4567
                  </a>
                  <a
                    href="mailto:info@petcarepro.com"
                    className="flex items-center text-gray-600 hover:text-primary duration-300"
                  >
                    <i className="fas fa-envelope text-base me-3 text-primary"></i>
                    info@petcarepro.com
                  </a>
                </div>
              </div>

              {/* Mobile Social Links */}
              <div className="mt-6 flex gap-4">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-base hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-base hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-base hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <i className="fab fa-x-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
