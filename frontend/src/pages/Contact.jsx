import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import * as contactApi from '../api/contactApi';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [settings, setSettings] = useState({
    phone: '(555) 123-4567',
    email: 'info@petcare.com',
    address: '168/170, Avenue 01, Mirpur DOHS, India',
    socialLinks: { facebook: 'https://www.facebook.com/', instagram: 'https://www.instagram.com/', twitter: 'https://x.com/' }
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await contactApi.getSettings();
        if (res?.success && res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Your name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!formData.message.trim()) tempErrors.message = 'Message content is required';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      const formEl = document.getElementById('contact-form-top');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await contactApi.submitMessage(formData);
      if (res?.success) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        setIsSubmitted(true);
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to send message' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setErrors({});
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">Contact Us</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">Contact Us</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Forms Section */}
      <section className="lg:py-20 py-10 bg-white" id="contact-form-top">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Reach Out
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-quicksand text-dark">
              Get In Touch <span className="text-primary">With Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-5 items-stretch">
            {/* Form */}
            <div className="bg-white border rounded-3xl xl:p-8 lg:p-6 p-4 shadow-lg relative overflow-hidden group flex flex-col justify-between">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>

              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center me-4 text-white shadow-md">
                    <i className="fas fa-comments text-xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold font-quicksand text-dark">Send Us a Message</h2>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-10 animate-fadeIn">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                      <i className="fas fa-check text-4xl"></i>
                    </div>
                    <h3 className="text-3xl font-bold font-quicksand text-dark mb-4">Message Sent!</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                      Thank you, <span className="font-bold text-primary">{formData.name}</span>! Your message has been sent successfully. We will get back to you within 24 hours.
                    </p>
                    <button onClick={handleReset} className="btn">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {Object.keys(errors).length > 0 && (
                      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3 text-sm">
                        <i className="fas fa-exclamation-circle text-lg mt-0.5"></i>
                        <div>
                          <strong className="font-bold block mb-1">Please fix the validation errors:</strong>
                          <ul className="list-disc ps-4 space-y-1">
                            {Object.values(errors).map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-semibold text-sm text-gray-700 mb-2">Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`form-input ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                          placeholder="Enter your name"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-sm text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-input ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-sm text-gray-700 mb-2">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`form-input ${errors.subject ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Enter email subject"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-sm text-gray-700 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`form-input ${errors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                        rows="4"
                        placeholder="Tell us about any special needs, behavioral concerns, or specific requests..."
                      ></textarea>
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.message}</p>
                      )}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn w-full flex justify-center items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner animate-spin"></i>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-envelope"></i>
                          Send Message
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center text-sm text-secondary mt-4">
                      <i className="fas fa-clock text-base text-primary me-2 animate-spin-slow"></i>
                      <span className="flex-1 text-gray-500">We typically respond to inquiries within 24 hours.</span>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Map Frame */}
            <div className="bg-white shadow-lg rounded-3xl overflow-hidden h-96 lg:h-auto min-h-[350px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2414523021944!2d-73.99051872417936!3d40.75986713434854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9f775f259%3A0xe3b156c36b1428a1!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1683121234567!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Petcare location map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="lg:py-20 py-10 bg-gradient-to-b from-white to-gray-50">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Get In Touch
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-quicksand text-dark">
              Contact <span className="text-primary">Information</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-5">
            {/* Visit card */}
            <div className="bg-white rounded-2xl xl:p-8 lg:p-6 p-4 shadow-lg text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-[1]">
                <div className="lg:w-20 lg:h-20 w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                  <i className="fas fa-map-marker-alt text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold font-quicksand text-dark mb-4">Visit Our Location</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {settings.address}
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary font-medium hover:underline text-sm"
                >
                  <span>Get Directions</span>
                  <i className="fas fa-arrow-right rtl:scale-x-[-1] text-xs ms-1"></i>
                </a>
              </div>
            </div>

            {/* Call card */}
            <div className="bg-white rounded-2xl xl:p-8 lg:p-6 p-4 shadow-lg text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-[1]">
                <div className="lg:w-20 lg:h-20 w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                  <i className="fas fa-phone text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold font-quicksand text-dark mb-4">Call Us</h3>
                <a href={`tel:${settings.phone}`} className="text-primary hover:underline text-xl font-bold block mb-4">
                  {settings.phone}
                </a>
                <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3">
                  <i className="far fa-clock me-1"></i> Mon-Sat: 8AM-6PM
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-semibold text-primary">Emergency:</span> 24/7 Support Available
                </p>
              </div>
            </div>

            {/* Email card */}
            <div className="bg-white rounded-2xl xl:p-8 lg:p-6 p-4 shadow-lg text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-[1]">
                <div className="lg:w-20 lg:h-20 w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                  <i className="fas fa-envelope text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold font-quicksand text-dark mb-4">Email Us</h3>
                <a href={`mailto:${settings.email}`} className="text-primary hover:underline text-xl font-bold block mb-5">
                  {settings.email}
                </a>
                <div className="flex justify-center gap-3">
                  <a
                    href={settings.socialLinks?.facebook || "https://www.facebook.com/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-base hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href={settings.socialLinks?.instagram || "https://www.instagram.com/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-base hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href={settings.socialLinks?.twitter || "https://x.com/"}
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
        </div>
      </section>
    </div>
  );
}
