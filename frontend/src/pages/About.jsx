import React from 'react';
import { Link } from 'react-router-dom';
import Counter from '../components/UI/Counter';
import TeamSwiper from '../components/About/TeamSwiper';

export default function About() {
  return (
    <div>
      {/* common banner */}
      <section
        className="banner-section relative lg:pt-20 pt-10 lg:pb-24 pb-12 bg-cover sm:bg-[right] bg-[80%] rtl:scale-x-[-1]"
        style={{ backgroundImage: "url('/assets/images/common-banner.png')" }}
      >
        <div className="md:container w-full mx-auto px-4 rtl:scale-x-[-1]">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">About Us</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">About Us</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-6 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-5 font-bold font-quicksand text-dark leading-tight">
                Welcome to The Pet Care Company
              </h2>
              <p className="mb-4 text-gray-600 leading-relaxed">
                Founded in 2015 by Sarah and Mike, two lifelong animal lovers, PetCare began as a small
                neighborhood grooming service.
                What started as a passion project has grown into the most trusted pet care facility in the area.
              </p>
              <p className="mb-5 text-gray-600 leading-relaxed">
                We believe that every pet deserves to be treated with love, respect, and professional care.
              </p>
              <ul className="list-disc font-medium ps-5 space-y-2 mb-8 text-gray-700">
                <li>Graceful goldfish, to small, cute kittens</li>
                <li>Hungry horses: whatever the size of your pet</li>
                <li>Feeders are either veterinary qualified staff</li>
                <li>Experienced pet owners and animal lovers</li>
              </ul>
              <div className="flex items-center">
                <img
                  src="/assets/images/team-1.png"
                  alt="Michael Chen"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div class="ms-4">
                  <h4 class="font-bold text-gray-800 mb-1">Michael Chen</h4>
                  <p class="text-primary font-medium text-sm">Owner Pet Care</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/images/about-image.png"
                alt="Pet grooming facility"
                className="mx-auto max-w-full h-auto rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="lg:py-20 py-10 bg-gradient-to-b from-white to-gray-50">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Our Achievements
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-quicksand text-dark">
              The Numbers Speak <span className="text-primary">Louder</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 gap-5">
            {/* Years in Business */}
            <div className="bg-white rounded-2xl xl:p-8 lg:p-6 p-4 shadow-lg text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-[1]">
                <div className="lg:w-20 lg:h-20 w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                  <i className="fas fa-calendar-alt lg:text-3xl text-2xl"></i>
                </div>
                <div className="xl:text-5xl md:text-4xl text-3xl font-bold text-dark mb-2">
                  <Counter end={8} />
                </div>
                <h3 className="lg:text-xl text-base font-quicksand font-semibold text-primary mb-2">Years</h3>
              </div>
            </div>

            {/* Happy Clients */}
            <div className="bg-white rounded-2xl xl:p-8 lg:p-6 p-4 shadow-lg text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-[1]">
                <div className="lg:w-20 lg:h-20 w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                  <i className="fas fa-thumbs-up lg:text-3xl text-2xl"></i>
                </div>
                <div className="xl:text-5xl md:text-4xl text-3xl font-bold text-dark mb-2">
                  <Counter end={5000} />+
                </div>
                <h3 className="lg:text-xl text-base font-quicksand font-semibold text-primary mb-2">Happy Clients</h3>
              </div>
            </div>

            {/* Certified Groomers */}
            <div className="bg-white rounded-2xl xl:p-8 lg:p-6 p-4 shadow-lg text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-[1]">
                <div className="lg:w-20 lg:h-20 w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                  <i className="fas fa-shield-alt lg:text-3xl text-2xl"></i>
                </div>
                <div className="xl:text-5xl md:text-4xl text-3xl font-bold text-dark mb-2">
                  <Counter end={15} />
                </div>
                <h3 className="lg:text-xl text-base font-quicksand font-semibold text-primary mb-2">Certified Groomers</h3>
              </div>
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-2xl xl:p-8 lg:p-6 p-4 shadow-lg text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-[1]">
                <div className="lg:w-20 lg:h-20 w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                  <i className="fas fa-paw lg:text-3xl text-2xl"></i>
                </div>
                <div className="xl:text-5xl md:text-4xl text-3xl font-bold text-dark mb-2">
                  <Counter end={20} />+
                </div>
                <h3 className="lg:text-xl text-base font-quicksand font-semibold text-primary mb-2">Services</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Team
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-quicksand text-dark">
              Meet Our <span class="text-primary">Experts</span>
            </h2>
          </div>
          <TeamSwiper />
        </div>
      </section>
    </div>
  );
}
