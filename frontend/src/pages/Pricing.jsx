import React from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const packages = [
    {
      name: 'Basic Package',
      desc: 'Perfect for routine care',
      price: 65,
      icon: 'fas fa-plus',
      features: [
        'Bath & Organic Shampoo',
        'Gentle Blow Dry',
        'Nail Trimming',
        'Ear Cleaning'
      ],
      btnText: 'Choose Basic',
      popular: false
    },
    {
      name: 'Premium Package',
      desc: 'Enhanced grooming experience',
      price: 95,
      icon: 'fas fa-dollar-sign',
      features: [
        'Everything in Basic',
        'Full Haircut & Styling',
        'Teeth Brushing',
        'Paw Pad Treatment'
      ],
      btnText: 'Choose Premium',
      popular: true
    },
    {
      name: 'Deluxe Package',
      desc: 'Ultimate luxury experience',
      price: 135,
      icon: 'fas fa-star',
      features: [
        'Everything in Premium',
        'Aromatherapy Treatment',
        'Luxury Fur Conditioning',
        'Complimentary Pet Toy'
      ],
      btnText: 'Choose Deluxe',
      popular: false
    },
    {
      name: 'Senior Care',
      desc: 'Gentle care for older pets',
      price: 110,
      icon: 'fas fa-heart',
      features: [
        'Gentle Bathing',
        'Joint-Friendly Handling',
        'Mobility Assessment',
        'Skin & Coat Evaluation'
      ],
      btnText: 'Choose Senior Care',
      popular: false
    },
    {
      name: 'Show Ready',
      desc: 'Competition & show preparation',
      price: 175,
      icon: 'fas fa-bolt',
      features: [
        'Breed-Specific Styling',
        'Show-Quality Products',
        'Coat Volumizing',
        'Competition Consultation'
      ],
      btnText: 'Choose Show Ready',
      popular: false
    }
  ];

  return (
    <div>
      {/* common banner */}
      <section
        className="banner-section relative lg:pt-20 pt-10 lg:pb-24 pb-12 bg-cover sm:bg-[right] bg-[80%] rtl:scale-x-[-1]"
        style={{ backgroundImage: "url('/assets/images/common-banner.png')" }}
      >
        <div className="md:container w-full mx-auto px-4 rtl:scale-x-[-1]">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">Pricing Packages</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">Pricing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`package-card flex flex-col sm:h-full group bg-white rounded-3xl xl:p-8 lg:p-6 p-4 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden ${
                  pkg.popular ? 'border-2 border-primary shadow-xl z-[1] !pt-10' : 'border border-gray-100 shadow-lg'
                }`}
              >
                <div className="flex-1">
                  {pkg.popular && (
                    <div className="absolute top-3 start-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  {!pkg.popular && (
                    <div className="absolute -top-10 -start-10 w-20 h-20 bg-primary/5 rounded-full"></div>
                  )}

                  <div className="lg:w-20 lg:h-20 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <i className={`${pkg.icon} lg:text-3xl text-2xl text-primary`}></i>
                  </div>

                  <h3 className="text-xl lg:text-2xl mb-2 font-bold font-quicksand text-dark">{pkg.name}</h3>
                  <div className="text-sm text-gray-500 mb-4">{pkg.desc}</div>
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-6">${pkg.price}</div>

                  <ul className="text-start space-y-3 lg:mb-8 mb-6 text-sm text-gray-700">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center">
                        <i className="fas fa-check text-green-500 me-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/service-booking?service=${
                    pkg.name === 'Basic Package' ? 'package-basic' :
                    pkg.name === 'Premium Package' ? 'package-premium' :
                    pkg.name === 'Deluxe Package' ? 'package-deluxe' :
                    pkg.name === 'Senior Care' ? 'package-senior' :
                    pkg.name === 'Show Ready' ? 'package-show' : ''
                  }`}
                  className={`w-full inline-flex items-center justify-center text-center px-5 py-3 rounded-full font-semibold transition duration-300 ${
                    pkg.popular
                      ? 'bg-primary text-white hover:bg-dark hover:scale-105 shadow-md'
                      : 'bg-primary/10 border border-primary/10 text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {pkg.btnText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment & Policies */}
      <section className="lg:py-20 py-10 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Policies
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-quicksand text-dark">
              Payment & <span className="text-primary">Policies</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-5">
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl lg:p-6 p-4 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                <i className="fas fa-credit-card text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold font-quicksand text-dark mb-3">Payment Methods</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                We accept cash, all major credit cards, and digital payments including Apple Pay and Google Pay.
              </p>
              <div className="flex gap-2">
                <span className="inline-block p-2 bg-gray-100 rounded-md">
                  <i className="fab fa-cc-visa text-xl text-blue-600"></i>
                </span>
                <span className="inline-block p-2 bg-gray-100 rounded-md">
                  <i className="fab fa-cc-mastercard text-xl text-red-500"></i>
                </span>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-2xl lg:p-6 p-4 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                <i className="fas fa-calendar-alt text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold font-quicksand text-dark mb-3">Cancellation Policy</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                24-hour notice required for cancellations. Late cancellations may incur a $15 fee.
              </p>
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                24-hour notice
              </div>
            </div>

            {/* Satisfaction Guarantee */}
            <div className="bg-white rounded-2xl lg:p-6 p-4 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                <i className="fas fa-check-circle text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold font-quicksand text-dark mb-3">Satisfaction Guarantee</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                100% satisfaction guaranteed. If you're not happy, we'll make it right or provide a full refund.
              </p>
              <div className="flex items-center">
                <i className="fas fa-star text-yellow-400"></i>
                <span className="ms-2 text-primary font-bold text-sm">100% Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
