import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white lg:pt-20 pt-10 pb-5">
      <div className="md:container w-full mx-auto px-4">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-8 gap-6 items-center">
          {/* Contacts */}
          <div>
            <h3 className="text-xl lg:mb-6 mb-5 text-primary">Contacts</h3>
            <div className="lg:space-y-4 space-y-3">
              <div className="flex items-center">
                <i className="fas fa-phone text-primary me-3"></i>
                <a href="tel:+8801701111000" className="flex-1 hover:text-primary transition duration-300">
                  +880 170 1111 000
                </a>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope text-primary me-3"></i>
                <a href="mailto:info@support.com" className="flex-1 hover:text-primary transition duration-300">
                  info@support.com
                </a>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-primary me-3"></i>
                <p className="flex-1 max-w-[200px]">168/170, Avenue 01, Mirpur DOHS, India</p>
              </div>
            </div>
          </div>

          {/* Center CTA */}
          <div className="xl:col-span-2 lg:col-span-1 sm:col-span-2 lg:order-none -order-1 text-center flex flex-col items-center justify-center h-full">
            <h2 className="max-w-xl text-2xl sm:text-3xl lg:text-4xl xl:text-5xl lg:mb-8 mb-5 leading-tight">
              Want To <span className="text-primary">Keep Your</span> Pet In Our Center?
            </h2>
            <Link to="/service-booking" className="btn hover:border-white focus:border-white min-w-[150px]">
              Book Now
            </Link>
          </div>

          {/* Opening Hours & Social */}
          <div className="sm:w-fit sm:ms-auto">
            <h3 className="text-xl lg:mb-6 mb-5 text-primary">Opening Hours</h3>
            <ul className="lg:space-y-3 space-y-2 lg:mb-6 mb-5">
              <li className="flex lg:gap-8 gap-5">
                <span>Mon - Fri:</span>
                <span>9.00AM - 6.00PM</span>
              </li>
              <li className="flex lg:gap-8 gap-5">
                <span>Saturday:</span>
                <span>9.00AM - 6.00PM</span>
              </li>
              <li className="flex lg:gap-8 gap-5">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
            <div className="flex gap-5 justify-start text-white">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition duration-300">
                <i className="fab fa-facebook-f lg:text-xl text-base"></i>
              </a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition duration-300">
                <i className="fab fa-x-twitter lg:text-xl text-base"></i>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition duration-300">
                <i className="fab fa-instagram lg:text-xl text-base"></i>
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition duration-300">
                <i className="fab fa-youtube lg:text-xl text-base"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 text-gray-300 lg:mt-10 mt-5 pt-5 flex items-center justify-center text-center">
          <p>
            &copy; {currentYear} Petcare. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
