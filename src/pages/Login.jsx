import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
      if (errors.email) setErrors({ ...errors, email: '' });
    } else {
      setPassword(value);
      if (errors.password) setErrors({ ...errors, password: '' });
    }
    setSubmitError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let tempErrors = {};
    if (!email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      loginUser(email, password);
      
      confetti({
        particleCount: 120,
        spread: 60,
        origin: { y: 0.8 }
      });

      // Dispatch login event to notify Header
      window.dispatchEvent(new Event('authChange'));

      // Redirect to account dashboard
      navigate('/account');
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <div>
      {/* common banner */}
      <section
        className="banner-section relative lg:pt-20 pt-10 lg:pb-24 pb-12 bg-cover sm:bg-[right] bg-[80%] rtl:scale-x-[-1]"
        style={{ backgroundImage: "url('/assets/images/common-banner.png')" }}
      >
        <div className="md:container w-full mx-auto px-4 rtl:scale-x-[-1]">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">Sign In</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">Sign In</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold font-quicksand text-dark mb-2">Welcome Back!</h3>
                <p className="text-gray-500 text-sm">Sign in to manage your appointments and pet profiles.</p>
              </div>

              {submitError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3 text-sm mb-6 animate-shake">
                  <i className="fas fa-exclamation-circle text-lg mt-0.5"></i>
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block font-semibold text-sm text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-gray-400"></i>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      className={`form-input !ps-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-sm text-gray-700 mb-2">Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400"></i>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={handleInputChange}
                      className={`form-input !ps-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-primary transition duration-200"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-end text-sm">
                  <a href="#forgot" className="text-primary hover:underline font-semibold" onClick={(e) => { e.preventDefault(); alert("Feature coming soon! Contact support for recovery."); }}>
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" className="w-full btn mt-2">
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </button>
              </form>

              <div className="text-center mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-semibold">
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
