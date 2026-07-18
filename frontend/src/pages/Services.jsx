import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as serviceApi from '../api/serviceApi';
import { CardSkeleton } from '../components/UI/SkeletonLoader';
import ServiceCard from '../components/UI/ServiceCard';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await serviceApi.getServices();
      if (res?.success) {
        setServices(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <div>
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

      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 text-xl mb-4">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <p className="text-gray-600 font-medium mb-4">{error}</p>
              <button onClick={fetchServices} className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-sm transition shadow-md">
                <i className="fas fa-redo me-2"></i>Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-5 gap-y-8">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="pt-6">
                    <CardSkeleton />
                  </div>
                ))
              ) : services.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500 font-medium">
                  No services available at the moment.
                </div>
              ) : (
                services.map((service) => (
                  <div key={service._id} className="pt-6">
                    <ServiceCard service={service} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

