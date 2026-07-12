import React from 'react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-3xl xl:p-8 lg:p-6 p-4 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
      <div className="absolute -top-6 start-8">
        <div className="md:w-16 md:h-16 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center transform group-hover:rotate-12 transition duration-300">
          <i className={`${service.icon} md:text-2xl text-xl text-primary`}></i>
        </div>
      </div>
      <div className="flex flex-col h-full xl:pt-8 pt-10">
        <div className="flex-1">
          <h3 className="text-xl lg:text-2xl mb-4 font-bold font-quicksand text-dark">
            <Link to={`/service-details?service=${service.value}`} className="hover:text-primary transition-colors">
              {service.name}
            </Link>
          </h3>
          <p className="text-gray-600 mb-5 leading-relaxed text-sm">{service.description}</p>
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
  );
}
