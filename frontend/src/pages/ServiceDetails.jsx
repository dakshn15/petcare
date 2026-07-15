import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as serviceApi from '../api/serviceApi';
import PageLoader from '../components/UI/PageLoader';

export default function ServiceDetails() {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service') || 'full-bath';
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState([]);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const res = await serviceApi.getService(serviceParam);
        if (res?.success && res.data) {
          const data = res.data;
          // Map properties for compatibility with existing UI logic
          const mapped = {
            ...data,
            desc: data.description,
            basePrice: data.price,
            included: (data.included || []).map((item, idx) => ({ ...item, id: idx + 1 })),
            addons: (data.addons || []).map((addon) => ({ ...addon, id: addon.addonId || addon._id }))
          };
          setService(mapped);
        }
      } catch (err) {
        console.error('Error fetching service details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [serviceParam]);

  const toggleAddon = (id) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const calculateTotalPrice = () => {
    if (!service) return 0;
    let total = service.basePrice;
    (service.addons || []).forEach((addon) => {
      if (selectedAddons.includes(addon.id)) {
        total += addon.price;
      }
    });
    return total;
  };

  if (loading) {
    return <PageLoader message="Loading service details…" />;
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-4">
        <span>Service not found</span>
        <Link to="/services" className="btn text-sm">View All Services</Link>
      </div>
    );
  }

  return (
    <div>
      {/* common banner */}
      <section
        className="banner-section relative lg:pt-20 pt-10 lg:pb-24 pb-12 bg-cover sm:bg-[right] bg-[80%] rtl:scale-x-[-1]"
        style={{ backgroundImage: "url('/assets/images/common-banner.png')" }}
      >
        <div className="md:container w-full mx-auto px-4 rtl:scale-x-[-1]">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">Service Details</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="flex items-center">
                <Link to="/services" className="hover:text-primary">Services</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">{service.name}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Service Detail */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-6 items-center">
            <div className="animate-fadeIn">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none mb-4">
                {service.tag}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 font-bold font-quicksand text-dark">{service.name}</h2>
              <p className="lg:mb-8 mb-5 text-gray-600 leading-relaxed">
                {service.desc}
              </p>
              <div className="flex flex-wrap gap-5 lg:mb-8 mb-5">
                <div className="flex items-center bg-white p-4 rounded-xl shadow w-full sm:w-auto border border-gray-100">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center me-4">
                    <i className="fas fa-clock text-xl text-primary"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-quicksand font-bold text-primary mb-1">{service.duration}</div>
                    <div className="text-sm text-secondary font-medium">Minutes</div>
                  </div>
                </div>
                <div className="flex items-center bg-white p-4 rounded-xl shadow w-full sm:w-auto border border-gray-100">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center me-4">
                    <i className="fas fa-dollar-sign text-xl text-primary"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-quicksand font-bold text-primary mb-1">${calculateTotalPrice()}+</div>
                    <div className="text-sm text-secondary font-medium">Starting Price</div>
                  </div>
                </div>
                <div className="flex items-center bg-white p-4 rounded-xl shadow w-full sm:w-auto border border-gray-100">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center me-4">
                    <i className="fas fa-star text-xl text-primary"></i>
                  </div>
                  <div>
                    <div className="text-base font-quicksand font-bold text-primary mb-2 flex items-center gap-1">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="text-sm text-secondary font-medium">Customer Rating</div>
                  </div>
                </div>
              </div>
              <Link to={`/service-booking?service=${service.value}${selectedAddons.length > 0 ? `&addons=${selectedAddons.join(',')}` : ''}`} className="btn">
                <i className="fas fa-calendar-alt"></i>
                Book This Service
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden relative pt-[75%] w-full shadow-xl">
              <img
                src="/assets/images/service-image.jpg"
                alt={`${service.name} service`}
                className="w-full h-full object-cover absolute inset-0 transform hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="lg:py-20 py-10 bg-gradient-to-b from-white to-primary/5 relative z-[1] overflow-hidden">
        {/* Decorative elements & water droplets */}
        <div className="absolute z-[-1] top-0 start-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 start-10 w-40 h-40 bg-primary/5 rounded-full hidden sm:block"></div>
          <div className="absolute bottom-10 end-10 w-60 h-60 bg-primary/5 rounded-full"></div>
          <div className="absolute top-1/4 end-1/4 w-20 h-20 bg-primary/5 rounded-full"></div>

          <div className="water-droplet" style={{ top: '15%', left: '10%', animationDelay: '0.5s' }}></div>
          <div className="water-droplet" style={{ top: '25%', right: '15%', animationDelay: '1.2s' }}></div>
          <div className="water-droplet" style={{ bottom: '20%', left: '20%', animationDelay: '2.1s' }}></div>
          <div className="water-droplet" style={{ bottom: '30%', right: '25%', animationDelay: '0.8s' }}></div>
        </div>

        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Comprehensive Care
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              What's <span className="text-primary">Included</span>
            </h2>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 ${service.included.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-4xl mx-auto'} lg:gap-8 gap-5`}>
            {service.included.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl lg:p-6 p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 group relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className={`${item.icon} text-2xl text-primary`}></i>
                </div>
                <div className="relative pe-8">
                  <h3 className="text-xl mb-2 font-bold font-quicksand text-dark">{item.name}</h3>
                  <span className="absolute -top-1 -end-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✓
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-10 mb-6">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Step by Step
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Our <span className="text-primary">Process</span>
            </h2>
          </div>

          <div className="relative">
            {/* Desktop Process Line */}
            <div className="hidden lg:block absolute top-24 start-0 w-full h-1">
              <div className="absolute start-[12.5%] top-1/2 -translate-y-1/2 w-[75%] h-1 bg-primary"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 gap-5">
              {service.process.map((p) => (
                <div
                  key={p.step}
                  className="bg-white lg:p-6 p-4 rounded-xl shadow-lg border border-gray-100 text-center relative group hover:shadow-xl transition-all duration-300"
                >
                  <div className="lg:w-20 lg:h-20 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-5 text-2xl font-quicksand font-bold group-hover:scale-110 transition-transform duration-300">
                    {p.step}
                  </div>
                  <h3 className="text-xl mb-3 font-bold font-quicksand text-dark">{p.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Add-Ons Section */}
      {service.addons && service.addons.length > 0 && (
        <section className="lg:py-20 py-10 bg-gradient-to-b from-white to-gray-100 border-t border-gray-200">
          <div className="md:container w-full mx-auto px-4">
            <div className="text-center lg:mb-10 mb-6">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                  Premium Options
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Optional <span className="text-primary">Add-Ons</span>
              </h2>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${service.addons.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-4xl mx-auto'} lg:gap-8 gap-5`}>
              {service.addons.map((addon) => {
                const isAdded = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    className={`bg-white rounded-xl xl:p-8 lg:p-6 p-4 shadow-lg border hover:shadow-xl transition-all duration-300 relative z-[1] overflow-hidden group flex flex-col justify-between ${
                      isAdded ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                    }`}
                  >
                    <div className="absolute z-[-1] top-0 end-0 w-24 h-24 bg-primary/5 rounded-full -me-12 -mt-12 group-hover:bg-primary/10 transition-colors duration-300"></div>
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center me-4">
                          <i className={`${addon.icon} text-xl text-primary`}></i>
                        </div>
                        <h3 className="flex-1 text-xl font-bold font-quicksand text-dark">{addon.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">{addon.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="text-primary font-bold text-xl">+${addon.price}</div>
                      <button
                        onClick={() => toggleAddon(addon.id)}
                        className={`btn text-sm !py-2 ${
                          isAdded ? 'btn-secondary bg-dark border-dark' : 'bg-primary border-primary'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <i className="fas fa-check me-1"></i> Added
                          </>
                        ) : (
                          'Add to Service'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Safety & Comfort Guarantees */}
      <section className="lg:py-20 py-10 bg-white border-t border-gray-100">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-12 mb-8">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Safety First
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-quicksand text-dark">
              Our Grooming <span className="text-primary">Comfort Guarantee</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto">
              We treat your pet like family. Here's how we guarantee their safety and well-being during every visit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Certified Stylists',
                desc: 'All our groomers are certified professionals trained in animal first aid and stress-free handling.',
                icon: 'fas fa-user-shield'
              },
              {
                title: 'Sanitized Station',
                desc: 'Every tub, table, brush, and scissor is thoroughly sanitized between sessions using pet-safe disinfectants.',
                icon: 'fas fa-pump-soap'
              },
              {
                title: '100% Organic Products',
                desc: 'We use premium, hypoallergenic, organic, and chemical-free shampoos customized for your pet\'s skin type.',
                icon: 'fas fa-leaf'
              },
              {
                title: 'Water & Treatment Breaks',
                desc: 'We offer fresh water, treats, and relaxation pauses to ensure a positive and calm experience.',
                icon: 'fas fa-water'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary text-xl group-hover:bg-primary group-hover:text-white transition duration-300">
                  <i className={item.icon}></i>
                </div>
                <h3 className="text-lg font-bold font-quicksand text-dark mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service FAQs */}
      <section className="lg:py-20 py-10 bg-gray-50 border-t border-gray-200">
        <div className="md:container w-full mx-auto px-4 max-w-4xl">
          <div className="text-center lg:mb-12 mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-quicksand text-dark">
              Grooming <span className="text-primary">FAQs</span>
            </h2>
            <p className="text-gray-600 mt-2">
              Common questions and answers regarding this grooming package.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What if my pet is nervous or aggressive during grooming?',
                a: 'Our stylists are highly trained in positive reinforcement and calm handling methods. If your pet gets too nervous, we take quiet breaks. We never force a session if it causes severe distress.'
              },
              {
                q: 'How long does a grooming session take?',
                a: 'Typically, it takes between 1.5 to 3 hours depending on the size of your pet, breed, coat thickness, and whether you chose additional add-ons like teeth cleaning or aromatherapy.'
              },
              {
                q: 'Do you use safe, pet-friendly products?',
                a: 'Absolutely! All of our shampoos, conditioners, and cleaning sprays are 100% natural, hypoallergenic, tear-free, and organic to prevent skin irritations.'
              },
              {
                q: 'Can I stay and watch the session?',
                a: 'To prevent pets from getting distracted or trying to jump off grooming tables, we ask owners to stay in the waiting lounge. Our lounge features large viewing windows where you can watch securely.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-dark text-lg font-quicksand mb-2 flex gap-3 items-start">
                  <span className="text-primary">Q.</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed ps-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
