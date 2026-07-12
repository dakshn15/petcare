import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../hooks/useAuth';
import * as adoptionApi from '../api/adoptionApi';

export default function Adoption() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const petTypeParam = searchParams.get('petType') || '';
  const breedParam = searchParams.get('breed') || '';
  const sizeParam = searchParams.get('size') || '';
  const genderParam = searchParams.get('gender') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    petType: petTypeParam,
    breed: breedParam,
    ageRange: '',
    gender: genderParam,
    size: sizeParam,
    address: '',
    reason: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=adoption${window.location.search}`);
      return;
    }
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      phone: user.phone,
      petType: petTypeParam || prev.petType,
      breed: breedParam || prev.breed,
      size: sizeParam || prev.size,
      gender: genderParam || prev.gender
    }));
  }, [user, navigate, petTypeParam, breedParam, sizeParam, genderParam]);

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
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,15}$/.test(formData.phone.trim())) {
      tempErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    if (!formData.petType) tempErrors.petType = 'Please select a pet type';
    if (!formData.address.trim()) tempErrors.address = 'Your complete address is required';
    if (!formData.reason.trim()) tempErrors.reason = 'Reason for adoption is required';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      const formEl = document.getElementById('adoption-card-top');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await adoptionApi.submitApplication({
        petType: formData.petType,
        breed: formData.breed,
        ageRange: formData.ageRange,
        gender: formData.gender,
        size: formData.size,
        address: formData.address,
        reason: formData.reason
      });

      if (res?.success) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        setIsSubmitted(true);
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to submit application' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setErrors({});
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      petType: '',
      breed: '',
      ageRange: '',
      gender: '',
      size: '',
      address: '',
      reason: ''
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">adopt your buddy</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center capitalize">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold capitalize text-dark">Adoption</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="lg:py-20 py-10 bg-white" id="adoption-card-top">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Book Now
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-quicksand text-dark">
              Find Your <span className="text-primary">Perfect Pet</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white h-full rounded-2xl shadow-xl xl:p-8 lg:p-6 p-4 border border-gray-100 relative overflow-hidden">
              <div className="absolute -top-10 -start-10 w-20 h-20 bg-primary/5 rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-10 -end-10 w-20 h-20 bg-primary/5 rounded-full pointer-events-none"></div>

              {isSubmitted ? (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6 animate-pulse">
                    <i className="fas fa-heart text-4xl"></i>
                  </div>
                  <h3 className="text-3xl font-bold font-quicksand text-dark mb-4">Application Submitted!</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-8">
                    Thank you, <span className="font-bold text-primary">{formData.name}</span>! Your adoption application has been registered. Our representative will contact you at <span className="font-semibold text-dark">{formData.phone}</span> or <span className="font-semibold text-dark">{formData.email}</span> within 24-48 hours to discuss details and schedule a home check.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button onClick={handleReset} className="btn">
                      Submit Another Application
                    </button>
                    <Link to="/" className="btn btn-secondary">
                      Go to Homepage
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5" noValidate>
                  <h3 className="text-2xl mb-2 col-span-1 sm:col-span-2 font-bold font-quicksand text-dark">Adoption Application</h3>

                  {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3 text-sm col-span-1 sm:col-span-2">
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

                  <div>
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Full Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                        <i className="fas fa-user w-5 h-5 text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`form-input !ps-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                        <i className="fas fa-envelope w-5 h-5 text-gray-400"></i>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={`form-input !ps-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                        <i className="fas fa-phone w-5 h-5 text-gray-400"></i>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                        className={`form-input !ps-10 ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Type of Pet *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                        <i className="fas fa-paw w-5 h-5 text-gray-400"></i>
                      </div>
                      <select
                        name="petType"
                        value={formData.petType}
                        onChange={handleInputChange}
                        className={`form-input !ps-10 ${errors.petType ? 'border-red-500 focus:border-red-500' : ''}`}
                      >
                        <option value="">Select Pet Type</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="rabbit">Rabbit</option>
                        <option value="bird">Bird</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {errors.petType && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{errors.petType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Breed</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                        <i className="fas fa-tag w-5 h-5 text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        name="breed"
                        value={formData.breed}
                        onChange={handleInputChange}
                        placeholder="e.g., Golden Retriever, Persian Cat"
                        className="form-input !ps-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Pet Age</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                        <i className="fas fa-calendar w-5 h-5 text-gray-400"></i>
                      </div>
                      <select
                        name="ageRange"
                        value={formData.ageRange}
                        onChange={handleInputChange}
                        className="form-input !ps-10"
                      >
                        <option value="">Select Age Range</option>
                        <option value="puppy-kitten">Puppy/Kitten (0-1 year)</option>
                        <option value="young">Young (1-3 years)</option>
                        <option value="adult">Adult (3-7 years)</option>
                        <option value="senior">Senior (7+ years)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Pet Gender</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                        <i className="fas fa-venus-mars w-5 h-5 text-gray-400"></i>
                      </div>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="form-input !ps-10"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="no-preference">No Preference</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Pet Size</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                        <i className="fas fa-ruler w-5 h-5 text-gray-400"></i>
                      </div>
                      <select
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="form-input !ps-10"
                      >
                        <option value="">Select Size</option>
                        <option value="small">Small (Under 25 lbs)</option>
                        <option value="medium">Medium (25-60 lbs)</option>
                        <option value="large">Large (60-100 lbs)</option>
                        <option value="extra-large">Extra Large (Over 100 lbs)</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Address *</label>
                    <div className="relative">
                      <div className="absolute top-3 start-3 flex items-start pointer-events-none">
                        <i className="fas fa-map-marker-alt w-5 h-5 text-gray-400"></i>
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className={`form-input !ps-10 ${errors.address ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Enter your complete address including city, state, and zip code"
                      ></textarea>
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{errors.address}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-2 text-sm text-gray-700">Reason for Adoption *</label>
                    <div className="relative">
                      <div className="absolute top-3 start-3 flex items-start pointer-events-none">
                        <i className="fas fa-heart w-5 h-5 text-gray-400"></i>
                      </div>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows="4"
                        className={`form-input !ps-10 ${errors.reason ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Please tell us why you want to adopt a pet and what kind of home environment you can provide..."
                      ></textarea>
                    </div>
                    {errors.reason && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{errors.reason}</p>
                    )}
                  </div>

                   <div className="sm:col-span-2">
                    <button type="submit" disabled={isSubmitting} className="w-full btn flex justify-center items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner animate-spin"></i>
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-heart w-4 h-4"></i>
                          Submit Application
                        </>
                      )}
                    </button>
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
