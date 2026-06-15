import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import HeroSwiper from '../components/Home/HeroSwiper';
import PetsSwiper from '../components/Home/PetsSwiper';
import TestimonialSwiper from '../components/Home/TestimonialSwiper';
import StarRating from '../components/UI/StarRating';

export default function Home() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState('premium'); // Default popular package
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePackageSelect = (pkgName) => {
    setSelectedPackage(pkgName);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewEmail || !reviewText) return;

    // Trigger success confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 }
    });

    setIsSubmitted(true);
    setTimeout(() => {
      // Reset form
      setReviewName('');
      setReviewEmail('');
      setReviewRating(5);
      setReviewText('');
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden lg:py-20 py-10 bg-cover"
        style={{ backgroundImage: 'url(/assets/images/home-bg.png)' }}
      >
        <div className="container-offset offset-left">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="md:max-w-2xl max-w-lg lg:pe-12 mb-8 lg:mb-0 lg:text-start text-center">
              <span className="inline-block lg:text-lg font-semibold mb-4 border-s-2 border-primary text-primary ps-3">
                Best Pet Care Service Company
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl xxl:text-7xl lg:mb-6 mb-4 font-bold">
                Provide Attention and Care for all the <span className="text-primary">Pets.</span>
              </h2>
              <p className="max-w-lg lg:text-xl lg:mb-8 mb-6 lg:mx-0 mx-auto text-gray-700">
                Ensure every pet receives proper attention and care for their well-being and happiness
              </p>
              <Link to="/contact" className="btn btn-secondary">
                Make A Reservation
              </Link>
            </div>
            <HeroSwiper />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative lg:py-20 py-10 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none"></div>
        <div className="absolute top-0 start-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 end-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="md:container w-full mx-auto px-4 relative">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                <i className="fas fa-check text-base me-2"></i>
                Premium Services
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Pamper Your <span className="text-primary">Furry Friend</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-5 gap-y-8">
            {/* Service Card 1 */}
            <div className="pt-6">
              <div className="group relative flex flex-col h-full bg-white rounded-3xl xl:p-8 lg:p-6 p-4 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                <div className="absolute -top-6 start-8">
                  <div className="md:w-16 md:h-16 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center transform group-hover:rotate-12 transition duration-300">
                    <i className="fas fa-bath md:text-2xl text-xl text-primary"></i>
                  </div>
                </div>
                <div className="flex flex-col h-full xl:pt-8 pt-10">
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl mb-4 font-bold">
                      <Link to="/service-details?service=full-bath" className="hover:text-primary">Full Service Bath</Link>
                    </h3>
                    <p className="text-gray-600 mb-5 leading-relaxed">
                      Luxurious bathing experience with premium organic shampoos, and gentle blow-drying.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">$45</div>
                    <Link
                      to="/service-booking?service=full-bath"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition duration-300"
                    >
                      Book Now
                      <i className="fas fa-arrow-right rtl:scale-x-[-1]"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="pt-6">
              <div className="group relative flex flex-col h-full bg-white rounded-3xl xl:p-8 lg:p-6 p-4 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                <div className="absolute -top-6 start-8">
                  <div className="md:w-16 md:h-16 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center transform group-hover:rotate-12 transition duration-300">
                    <i className="fas fa-cut md:text-2xl text-xl text-primary"></i>
                  </div>
                </div>
                <div className="flex flex-col h-full xl:pt-8 pt-10">
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl mb-4 font-bold">
                      <Link to="/service-details?service=haircut" className="hover:text-primary">Professional Haircut</Link>
                    </h3>
                    <p className="text-gray-600 mb-5 leading-relaxed">
                      Expert styling and precision trimming to keep your pet looking fabulous and feeling comfortable.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">$35</div>
                    <Link
                      to="/service-booking?service=haircut"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition duration-300"
                    >
                      Book Now
                      <i className="fas fa-arrow-right rtl:scale-x-[-1]"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="pt-6">
              <div className="group relative flex flex-col h-full bg-white rounded-3xl xl:p-8 lg:p-6 p-4 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                <div className="absolute -top-6 start-8">
                  <div className="md:w-16 md:h-16 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center transform group-hover:rotate-12 transition duration-300">
                    <i className="fas fa-paw md:text-2xl text-xl text-primary"></i>
                  </div>
                </div>
                <div className="flex flex-col h-full xl:pt-8 pt-10">
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl mb-4 font-bold">
                      <Link to="/service-details?service=nail-care" className="hover:text-primary">Nail Care</Link>
                    </h3>
                    <p className="text-gray-600 mb-5 leading-relaxed">
                      Gentle and precise nail trimming with paw care treatment for your pet's comfort and health.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">$20</div>
                    <Link
                      to="/service-booking?service=nail-care"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition duration-300"
                    >
                      Book Now
                      <i className="fas fa-arrow-right rtl:scale-x-[-1]"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center lg:mt-8 mt-6">
            <Link to="/services" className="btn btn-secondary group">
              Explore All Services
              <i className="fas fa-arrow-right rtl:scale-x-[-1]"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Pets for Adoption Section */}
      <section className="lg:py-20 py-10 bg-gray-50/50">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                <i className="fas fa-heart text-base me-2"></i>
                Adopt a Friend
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Pets Available for <span className="text-primary">Adoption</span>
            </h2>
          </div>
          <PetsSwiper />
        </div>
      </section>

      {/* Packages Section */}
      <section className="lg:py-20 py-10 relative overflow-hidden bg-gradient-to-b from-white to-primary/5">
        <div className="absolute top-0 end-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 start-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* SVG paw decorations */}
        <div className="absolute top-20 start-10 opacity-10 pointer-events-none">
          <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,8.5A1.5,1.5 0 0,1 10.5,7A1.5,1.5 0 0,1 12,5.5A1.5,1.5 0 0,1 13.5,7A1.5,1.5 0 0,1 12,8.5M12,2A5,5 0 0,0 7,7C7,9.97 9.03,12 12,12C14.97,12 17,9.97 17,7A5,5 0 0,0 12,2M21.5,18.5L14.5,13.5V14.5L7.5,12.5L3.5,16.5L2,14L7,9L15,12V11L22,16L21.5,18.5Z" />
          </svg>
        </div>
        <div className="absolute top-40 end-20 opacity-10 rotate-45 pointer-events-none">
          <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,8.5A1.5,1.5 0 0,1 10.5,7A1.5,1.5 0 0,1 12,5.5A1.5,1.5 0 0,1 13.5,7A1.5,1.5 0 0,1 12,8.5M12,2A5,5 0 0,0 7,7C7,9.97 9.03,12 12,12C14.97,12 17,9.97 17,7A5,5 0 0,0 12,2M21.5,18.5L14.5,13.5V14.5L7.5,12.5L3.5,16.5L2,14L7,9L15,12V11L22,16L21.5,18.5Z" />
          </svg>
        </div>

        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-14 sm:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                <i className="fas fa-check text-base me-2"></i>
                Premium Care Packages
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Tailored Grooming <span className="text-primary"> Packages</span>
            </h2>
          </div>

          {/* Packages Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-6 max-w-6xl mx-auto">
            {/* Basic Package */}
            <div
              className={`package-card flex flex-col sm:h-full group bg-white rounded-2xl shadow-lg xl:p-8 lg:p-6 p-4 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden border-2 ${
                selectedPackage === 'basic' ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <div className="flex-1">
                <div className="absolute -top-10 -start-10 w-20 h-20 bg-primary/10 rounded-full"></div>
                <div className="lg:w-20 lg:h-20 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-plus lg:text-3xl text-2xl text-primary"></i>
                </div>
                <h3 className="text-xl lg:text-2xl mb-2 font-bold font-quicksand text-dark">Basic Package</h3>
                <div className="text-sm text-gray-500 mb-4 font-medium">Perfect for routine care</div>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-5">$65</div>

                <ul className="text-start space-y-3 lg:mb-8 mb-5 text-gray-600 font-medium">
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Bath & Organic Shampoo
                  </li>
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Gentle Blow Dry
                  </li>
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Nail Trimming
                  </li>
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Ear Cleaning
                  </li>
                </ul>
              </div>
              <button
                onClick={() => { handlePackageSelect('basic'); navigate('/service-booking?service=package-basic'); }}
                className={`w-full inline-flex items-center justify-center text-center px-5 py-3 border rounded-full font-semibold leading-none transition duration-300 cursor-pointer ${
                  selectedPackage === 'basic'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-primary/10 border-primary/10 text-primary hover:bg-primary hover:text-white'
                }`}
              >
                Choose Basic
              </button>
            </div>

            {/* Premium Package */}
            <div
              className={`package-card flex flex-col sm:h-full group bg-white rounded-2xl shadow-xl xl:p-8 lg:p-6 p-4 !pt-8 sm:mt-0 mt-4 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative z-[1] border-2 ${
                selectedPackage === 'premium' ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <div className="flex-1">
                <div className="absolute -top-4 start-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </div>
                <div className="lg:w-20 lg:h-20 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 mt-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-dollar-sign lg:text-3xl text-2xl text-primary"></i>
                </div>
                <h3 className="text-xl lg:text-2xl mb-2 font-bold font-quicksand text-dark">Premium Package</h3>
                <div className="text-sm text-gray-500 mb-4 font-medium">Enhanced grooming experience</div>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-5">$95</div>

                <ul className="text-start space-y-3 lg:mb-8 mb-5 text-gray-600 font-medium">
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Everything in Basic
                  </li>
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Full Haircut & Styling
                  </li>
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Teeth Brushing
                  </li>
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Paw Pad Treatment
                  </li>
                </ul>
              </div>
              <button
                onClick={() => { handlePackageSelect('premium'); navigate('/service-booking?service=package-premium'); }}
                className={`w-full inline-flex items-center justify-center text-center px-5 py-3 border rounded-full font-semibold leading-none transition duration-300 cursor-pointer ${
                  selectedPackage === 'premium'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-primary/10 border-primary/10 text-primary hover:bg-primary hover:text-white'
                }`}
              >
                Choose Premium
              </button>
            </div>

            {/* Deluxe Package */}
            <div
              className={`package-card flex flex-col sm:h-full group bg-white rounded-2xl shadow-lg xl:p-8 lg:p-6 p-4 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden border-2 ${
                selectedPackage === 'deluxe' ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <div className="flex-1">
                <div className="absolute -bottom-10 -end-10 w-20 h-20 bg-primary/10 rounded-full"></div>
                <div className="lg:w-20 lg:h-20 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-star lg:text-3xl text-2xl text-primary"></i>
                </div>
                <h3 className="text-xl lg:text-2xl mb-2 font-bold font-quicksand text-dark">Deluxe Package</h3>
                <div className="text-sm text-gray-500 mb-4 font-medium">Ultimate luxury experience</div>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-5">$135</div>

                <ul className="text-start space-y-3 lg:mb-8 mb-5 text-gray-600 font-medium">
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Everything in Premium
                  </li>
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Aromatherapy Treatment
                  </li>
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Luxury Fur Conditioning
                  </li>
                  <li className="flex items-center justify-center sm:justify-start">
                    <i className="fas fa-check text-green-500 me-3"></i>
                    Complimentary Pet Toy
                  </li>
                </ul>
              </div>
              <button
                onClick={() => { handlePackageSelect('deluxe'); navigate('/service-booking?service=package-deluxe'); }}
                className={`w-full inline-flex items-center justify-center text-center px-5 py-3 border rounded-full font-semibold leading-none transition duration-300 cursor-pointer ${
                  selectedPackage === 'deluxe'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-primary/10 border-primary/10 text-primary hover:bg-primary hover:text-white'
                }`}
              >
                Choose Deluxe
              </button>
            </div>
          </div>

          <div className="text-center lg:mt-8 mt-6">
            <Link to="/pricing" className="btn btn-secondary group">
              Explore All Packages
              <i className="fas fa-arrow-right rtl:scale-x-[-1]"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="lg:py-20 py-10 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/images/testimonial-bg.png)' }}
      >
        <div className="md:container w-full mx-auto px-4">
          <div className="grid items-center grid-cols-1 lg:grid-cols-3 lg:gap-8 gap-6">
            {/* Testimonials Column */}
            <div className="lg:col-span-2">
              <div className="text-center lg:text-start lg:mb-10 mb-6">
                <div className="inline-block mb-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                    <i className="fas fa-heart text-base me-2"></i>
                    Client Reviews
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  What Pet Parents <span className="text-primary">Say</span>
                </h2>
              </div>
              <TestimonialSwiper />
            </div>

            {/* Review Form Column */}
            <div className="lg:col-span-1">
              <div className="text-center lg:text-start lg:mb-6 mb-4">
                <h3 className="text-xl lg:text-2xl mb-2 font-bold font-quicksand text-dark">
                  Share Your <span className="text-primary">Experience</span>
                </h3>
                <p className="text-gray-600 text-sm font-medium">Help other pet parents make the best choice.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 relative overflow-hidden">
                <div className="absolute -top-10 -start-10 w-20 h-20 bg-primary/5 rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-10 -end-10 w-20 h-20 bg-primary/5 rounded-full pointer-events-none"></div>

                {isSubmitted ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
                      <i className="fas fa-check text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold text-dark mb-2">Review Submitted!</h4>
                    <p className="text-gray-600 text-sm max-w-[200px] mx-auto">
                      Thank you for sharing your experience with the Petcare community.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Your Name *</label>
                      <input
                        type="text"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Enter your name"
                        className="form-input !text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Email *</label>
                      <input
                        type="email"
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="form-input !text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Rating *</label>
                      <StarRating rating={reviewRating} onChange={setReviewRating} interactive={true} />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">Your Review *</label>
                      <textarea
                        rows="3"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Tell us about your experience..."
                        className="form-input !text-sm"
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full btn !text-sm !py-2">
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="lg:py-20 py-10 bg-primary relative z-[1] overflow-hidden">
        <img
          className="rtl:scale-x-[-1] absolute z-[-1] start-0 bottom-0 max-w-[14vw] sm:max-w-[10vw] w-full pointer-events-none"
          src="/assets/images/cat.png"
          alt="cat-image"
        />
        <img
          className="rtl:scale-x-[-1] absolute z-[-1] sm:end-10 end-0 bottom-0 max-w-[14vw] sm:max-w-[10vw] w-full pointer-events-none"
          src="/assets/images/dog.png"
          alt="dog-image"
        />
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
              Give Your Friend the Care They Deserve. Connect With Our Team Today!
            </h2>
            <p className="max-w-3xl mx-auto lg:text-lg xl:text-xl lg:mb-8 mb-5 opacity-90 leading-relaxed">
              From playful pups to curious kittens, we're here to make every tail wag and every purr louder. Reach out and let's make your pet's day extra special!
            </p>
            <Link to="/contact" className="btn hover:!border-white focus:!border-white btn-secondary">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
