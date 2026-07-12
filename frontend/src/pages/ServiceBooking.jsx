import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../hooks/useAuth';
import * as serviceApi from '../api/serviceApi';
import * as bookingApi from '../api/bookingApi';

export default function ServiceBooking() {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  const addonsParam = searchParams.get('addons'); // comma-separated list of addonIds
  const { user } = useAuth();
  const navigate = useNavigate();

  const [servicesList, setServicesList] = useState([
    { value: 'full-bath', label: 'Full Service Bath - $45' },
    { value: 'haircut', label: 'Professional Haircut - $35' },
    { value: 'nail-care', label: 'Nail Care - $20' },
    { value: 'aromatherapy', label: 'Luxury Aromatherapy Bath - $55' },
    { value: 'breed-styling', label: 'Breed-Specific Styling - $65' },
    { value: 'paw-spa', label: 'Paw & Nail Spa - $30' },
    { value: 'dental', label: 'Dental Care Package - $40' },
    { value: 'deshedding', label: 'De-shedding Treatment - $50' },
    { value: 'flea-tick', label: 'Flea & Tick Treatment - $45' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    petName: '',
    petType: '',
    service: serviceParam || '',
    petSize: '',
    date: '',
    time: '',
    notes: ''
  });

  const [activeServiceObj, setActiveServiceObj] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=service-booking');
      return;
    }
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      phone: user.phone
    }));
  }, [user, navigate]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceApi.getServices();
        if (res?.success && res.data) {
          const opts = res.data.map(s => ({
            value: s.value,
            label: `${s.name} - $${s.price}`
          }));
          setServicesList(opts);
        }
      } catch (err) {
        console.error('Error fetching services options:', err);
      }
    };
    fetchServices();
  }, []);

  // Fetch details of selected service
  useEffect(() => {
    if (!formData.service) {
      setActiveServiceObj(null);
      setSelectedAddons([]);
      return;
    }
    const fetchServiceDetails = async () => {
      try {
        const res = await serviceApi.getService(formData.service);
        if (res?.success && res.data) {
          setActiveServiceObj(res.data);
          // Parse initial addons from URL if it matches the current service Param
          if (serviceParam === formData.service && addonsParam) {
            const list = addonsParam.split(',').filter(Boolean);
            setSelectedAddons(list);
          } else {
            setSelectedAddons([]);
          }
        }
      } catch (err) {
        console.error('Error fetching active service:', err);
      }
    };
    fetchServiceDetails();
  }, [formData.service, serviceParam, addonsParam]);

  // Sync service dropdown with URL search param changes
  useEffect(() => {
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }
  }, [serviceParam]);

  const toggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const getCalculatedPrice = () => {
    if (!activeServiceObj) return 0;
    let total = activeServiceObj.price || 0;
    (activeServiceObj.addons || []).forEach(addon => {
      const idStr = addon.addonId || addon._id?.toString() || '';
      if (selectedAddons.includes(idStr)) {
        total += addon.price;
      }
    });
    return total;
  };

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
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,15}$/.test(formData.phone.trim())) {
      tempErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!formData.petName.trim()) tempErrors.petName = 'Pet name is required';
    if (!formData.petType) tempErrors.petType = 'Please select a pet type';
    if (!formData.service) tempErrors.service = 'Please select a service';
    if (!formData.date) tempErrors.date = 'Preferred date is required';
    
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      // Scroll to top of the form area
      const formEl = document.getElementById('booking-card-top');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await bookingApi.createBooking({
        serviceValue: formData.service,
        petName: formData.petName,
        petType: formData.petType,
        petSize: formData.petSize,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        addons: selectedAddons
      });

      if (res?.success) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });

        setBookingSummary({
          ...formData,
          serviceLabel: res.data?.serviceLabel || formData.service
        });
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to submit booking' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewBooking = () => {
    setBookingSummary(null);
    setErrors({});
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      petName: '',
      petType: '',
      service: '',
      petSize: '',
      date: '',
      time: '',
      notes: ''
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">Service Booking</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">Service Booking</li>
            </ul>
          </div>
        </div>
      </section>

      {/* service booking form */}
      <section className="lg:py-20 py-10 bg-white" id="booking-card-top">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Book Now
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-quicksand text-dark">
              Schedule Your Pet's <span className="text-primary">Service</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white h-full rounded-2xl shadow-xl xl:p-8 lg:p-6 p-4 border border-gray-100 relative overflow-hidden">
              <div className="absolute -top-10 -start-10 w-20 h-20 bg-primary/5 rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-10 -end-10 w-20 h-20 bg-primary/5 rounded-full pointer-events-none"></div>

              {bookingSummary ? (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6 animate-pulse">
                    <i className="fas fa-calendar-check text-4xl"></i>
                  </div>
                  <h3 className="text-3xl font-bold font-quicksand text-dark mb-4">Booking Requested!</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-8">
                    We've received your booking request for <span className="font-bold text-primary">{bookingSummary.petName}</span>. A member of our team will contact you at <span className="font-semibold text-dark">{bookingSummary.phone}</span> or <span className="font-semibold text-dark">{bookingSummary.email}</span> within 24 hours to confirm your appointment.
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-6 text-start mb-8 border max-w-lg mx-auto">
                    <h4 className="font-bold text-lg mb-4 pb-2 border-b text-dark">Appointment Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <span className="text-gray-500 block">Owner Name</span>
                        <strong className="text-dark">{bookingSummary.name}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Service</span>
                        <strong className="text-primary">{bookingSummary.serviceLabel}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Pet Details</span>
                        <strong className="text-dark capitalize">{bookingSummary.petType} ({bookingSummary.petSize || 'Medium'})</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Preferred Date/Time</span>
                        <strong className="text-dark">{bookingSummary.date} {bookingSummary.time ? `(${bookingSummary.time})` : ''}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center">
                    <button onClick={handleNewBooking} className="btn">
                      Book Another Service
                    </button>
                    <Link to="/" className="btn btn-secondary">
                      Go to Homepage
                    </Link>
                  </div>
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
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Your Name *</label>
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
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`form-input ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="(123) 456-7890"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Email Address *</label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Pet Name *</label>
                      <input
                        type="text"
                        name="petName"
                        value={formData.petName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.petName ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Pet's name"
                      />
                      {errors.petName && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.petName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Pet Type *</label>
                      <select
                        name="petType"
                        value={formData.petType}
                        onChange={handleInputChange}
                        className={`form-input ${errors.petType ? 'border-red-500 focus:border-red-500' : ''}`}
                      >
                        <option value="">Select pet type</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.petType && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.petType}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Service Needed *</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className={`form-input ${errors.service ? 'border-red-500 focus:border-red-500' : ''}`}
                      >
                        <option value="">Select service</option>
                        {servicesList.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.service}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Pet Size</label>
                      <select
                        name="petSize"
                        value={formData.petSize}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="">Select size</option>
                        <option value="small">Small (under 25 lbs)</option>
                        <option value="medium">Medium (25-60 lbs)</option>
                        <option value="large">Large (60-90 lbs)</option>
                        <option value="xlarge">Extra Large (90+ lbs)</option>
                      </select>
                    </div>
                  </div>

                  {activeServiceObj && activeServiceObj.addons && activeServiceObj.addons.length > 0 && (
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                      <h4 className="font-bold font-quicksand text-dark text-sm">Select Service Add-Ons:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeServiceObj.addons.map((addon) => {
                          const addonId = addon.addonId || addon._id?.toString();
                          const isChecked = selectedAddons.includes(addonId);
                          return (
                            <label
                              key={addonId}
                              className={`flex items-center gap-3 p-3 bg-white rounded-xl border cursor-pointer select-none transition ${
                                isChecked ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleAddon(addonId)}
                                className="rounded text-primary focus:ring-primary w-4 h-4 border-gray-300"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-dark truncate">{addon.name}</div>
                                <div className="text-[10px] text-gray-400 truncate">{addon.desc}</div>
                              </div>
                              <span className="text-xs font-bold text-primary shrink-0">+${addon.price}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Preferred Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className={`form-input ${errors.date ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      {errors.date && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.date}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Preferred Time</label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="">Select time</option>
                        <option value="morning">Morning (8AM-12PM)</option>
                        <option value="afternoon">Afternoon (12PM-5PM)</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Special Requests or Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="form-input"
                      rows="4"
                      placeholder="Tell us about any special needs, behavioral concerns, or specific requests..."
                    ></textarea>
                  </div>

                  {activeServiceObj && (
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex justify-between items-center text-sm font-semibold">
                      <span className="text-secondary font-medium">Estimated Pricing (Base + Add-Ons):</span>
                      <span className="text-primary text-lg font-bold">${getCalculatedPrice()}</span>
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting} className="btn w-full flex justify-center items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner animate-spin"></i>
                        Booking Service...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calendar-alt"></i>
                        Book Service
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center text-sm text-secondary mt-4 border-t pt-4">
                    <i className="fas fa-info-circle text-base text-primary me-2"></i>
                    <span className="flex-1 font-medium">We'll contact you within 24 hours to confirm your appointment.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
