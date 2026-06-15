import React from 'react';
import { Link } from 'react-router-dom';

const servicesData = [
  {
    id: 1,
    value: 'full-bath',
    name: 'Full Service Bath',
    price: 45,
    icon: 'fas fa-bath',
    desc: 'Luxurious bathing experience with premium organic shampoos, and gentle blow-drying.'
  },
  {
    id: 2,
    value: 'haircut',
    name: 'Professional Haircut',
    price: 35,
    icon: 'fas fa-cut',
    desc: 'Expert styling and precision trimming to keep your pet looking fabulous and feeling comfortable.'
  },
  {
    id: 3,
    value: 'nail-care',
    name: 'Nail Care',
    price: 20,
    icon: 'fas fa-paw',
    desc: "Gentle and precise nail trimming with paw care treatment for your pet's comfort and health."
  },
  {
    id: 4,
    value: 'aromatherapy',
    name: 'Luxury Aromatherapy Bath',
    price: 55,
    icon: 'fas fa-spa',
    desc: 'Premium spa experience with calming essential oils, deep conditioning treatment, and warm towel massage for ultimate relaxation.'
  },
  {
    id: 5,
    value: 'breed-styling',
    name: 'Breed-Specific Styling',
    price: 65,
    icon: 'fas fa-star',
    desc: "Specialized grooming tailored to your pet's breed standards with expert styling techniques and premium finishing products."
  },
  {
    id: 6,
    value: 'paw-spa',
    name: 'Paw & Nail Spa',
    price: 30,
    icon: 'fas fa-paw',
    desc: 'Complete paw care including nail trimming, pad moisturizing treatment, and gentle filing for healthy, comfortable paws.'
  },
  {
    id: 7,
    value: 'dental',
    name: 'Dental Care Package',
    price: 40,
    icon: 'fas fa-shield-alt',
    desc: 'Complete dental hygiene service including teeth brushing, breath freshening treatment, and gum health assessment.'
  },
  {
    id: 8,
    value: 'deshedding',
    name: 'De-shedding Treatment',
    price: 50,
    icon: 'fas fa-play-circle',
    desc: 'Specialized treatment to reduce shedding by up to 90%, including deep brushing, special shampoo, and conditioning treatment.'
  },
  {
    id: 9,
    value: 'flea-tick',
    name: 'Flea & Tick Treatment',
    price: 45,
    icon: 'fas fa-bug',
    desc: 'Comprehensive parasite control treatment including medicated bath, thorough inspection, and preventative application.'
  }
];

export default function Services() {
  return (
    <div>
      {/* common banner */}
      <section
        className="banner-section relative lg:pt-20 pt-10 lg:pb-24 pb-12 bg-cover sm:bg-[right] bg-[80%] rtl:scale-x-[-1]"
        style={{ backgroundImage: "url('/assets/images/common-banner.png')" }}
      >
        <div className="md:container w-full mx-auto px-4 rtl:scale-x-[-1]">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">Our Services</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">Services</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-5 gap-y-8">
            {servicesData.map((service) => (
              <div key={service.id} className="pt-6">
                <div className="group relative flex flex-col h-full bg-white rounded-3xl xl:p-8 lg:p-6 p-4 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                  <div className="absolute -top-6 start-8">
                    <div className="md:w-16 md:h-16 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center transform group-hover:rotate-12 transition duration-300">
                      <i className={`${service.icon} md:text-2xl text-xl text-primary`}></i>
                    </div>
                  </div>
                  <div className="flex flex-col h-full xl:pt-8 pt-10">
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl mb-4 font-bold font-quicksand text-dark">
                        <Link to={`/service-details?service=${service.value}`} className="hover:text-primary transition duration-200">
                          {service.name}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-5 leading-relaxed text-sm">{service.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-2xl font-bold text-primary">${service.price}</div>
                      <Link
                        to={`/service-booking?service=${service.value}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition duration-300 text-sm"
                      >
                        Book Now
                        <i className="fas fa-arrow-right rtl:scale-x-[-1]"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
