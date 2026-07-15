import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Accordion from '../components/UI/Accordion';
import * as faqApi from '../api/faqApi';

export default function FAQ() {
  const [faqCategories, setFaqCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await faqApi.getFAQs();
        if (res?.success && res.data) {
          setFaqCategories(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  return (
    <div>
      {/* common banner */}
      <section
        className="banner-section relative lg:pt-20 pt-10 lg:pb-24 pb-12 bg-cover sm:bg-[right] bg-[80%] rtl:scale-x-[-1]"
        style={{ backgroundImage: "url('/assets/images/common-banner.png')" }}
      >
        <div className="md:container w-full mx-auto px-4 rtl:scale-x-[-1]">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">Frequently Asked Questions</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">FAQs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-fade-in">
            {loading ? (
              <div className="text-center py-12 text-gray-400 font-medium">Loading FAQs...</div>
            ) : faqCategories.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-medium">No FAQs found.</div>
            ) : (
              faqCategories.map((cat, idx) => (
                <div key={idx} className="lg:mb-12 mb-8">
                  <div className="flex items-center lg:mb-8 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center me-4 text-white shadow-md">
                      <i className={`${cat.icon || 'fas fa-question-circle'} text-base`}></i>
                    </div>
                    <h2 className="text-2xl font-bold font-quicksand text-dark">{cat.category}</h2>
                  </div>
                  <div className="space-y-5">
                    {cat.items?.map((item, itemIdx) => (
                      <Accordion key={itemIdx || item._id} title={item.question}>
                        {item.answer}
                      </Accordion>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* Still Have Questions */}
            <div className="lg:mt-12 mt-8 bg-primary/10 rounded-3xl xl:p-10 lg:p-8 p-6 text-center relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="absolute bottom-0 start-0 w-32 h-32 bg-primary/5 rounded-full -ms-16 -mb-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-[1]">
                <h3 className="text-2xl md:text-3xl font-bold font-quicksand text-dark mb-4">Still Have Questions?</h3>
                <p className="mb-6 max-w-xl mx-auto text-gray-600 leading-relaxed text-sm md:text-base">
                  Our friendly team is here to help with any questions you might have about our pet care services.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-dark hover:scale-105 transition-all duration-300 shadow-md text-sm"
                  >
                    <i className="fas fa-envelope"></i>
                    Contact Us
                  </Link>
                  <a
                    href="tel:+1234567890"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full font-semibold hover:bg-dark hover:scale-105 transition-all duration-300 shadow-md text-sm"
                  >
                    <i className="fas fa-phone"></i>
                    Call Us
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
