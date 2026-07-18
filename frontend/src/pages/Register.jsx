import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import confetti from 'canvas-confetti';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,15}$/.test(formData.phone)) {
      tempErrors.phone = 'Phone number must be between 10-15 digits';
    }
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.phone, formData.password);

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.8 }
      });

      // Redirect to account dashboard
      navigate('/account');
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err && typeof err === 'object' ? err.message : String(err);
      setSubmitError(msg || 'Registration failed');
    } finally {
      setIsSubmitting(false);
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">Register</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">Register</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Register Form Section */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>

              <div className="text-center mb-6">
                <h3 className="text-2xl lg:text-3xl font-bold font-quicksand text-dark mb-2">Create Account</h3>
                <p className="text-gray-500 text-sm font-medium">Join us today to book services and adopt pets easily.</p>
              </div>

              {submitError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-sm mb-6 animate-shake">
                  <i className="fas fa-exclamation-circle text-lg"></i>
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block font-semibold text-sm text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                      <i className="fas fa-user text-gray-400 text-sm"></i>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`form-input !text-sm !ps-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Enter full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-sm text-gray-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-gray-400 text-sm"></i>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input !text-sm !ps-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-sm text-gray-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                      <i className="fas fa-phone text-gray-400 text-sm"></i>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-input !text-sm !ps-10 ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="e.g. 5551234567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-sm text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400 text-sm"></i>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input !text-sm !ps-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="At least 6 characters"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-sm text-gray-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400 text-sm"></i>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-input !text-sm !ps-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Repeat your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-primary transition duration-200"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{errors.confirmPassword}</p>
                  )}
                </div>

                 <button type="submit" disabled={isSubmitting} className="w-full btn mt-4 flex justify-center items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner animate-spin"></i>
                      Registering...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i>
                      Register Now
                    </>
                  )}
                </button>
              </form>

              <div className="text-center sm:mt-6 sm:pt-6 mt-5 pt-4 border-t border-gray-100 text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Sign In here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
