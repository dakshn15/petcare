import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Full services details dictionary
const allServicesData = {
  'full-bath': {
    name: 'Full Service Bath',
    tag: 'Premium Service',
    desc: 'Give your pet the ultimate spa experience with our comprehensive bathing service. We use only the finest, pet-safe products and techniques to ensure your furry friend leaves feeling clean, fresh, and pampered.',
    basePrice: 45,
    duration: '45-60',
    included: [
      { id: 1, name: 'Premium Shampoo', desc: "High-quality, pet-safe shampoo selected based on your pet's coat type and skin sensitivity.", icon: 'fas fa-flask' },
      { id: 2, name: 'Conditioning Treatment', desc: "Moisturizing conditioner to keep your pet's coat soft, shiny, and tangle-free.", icon: 'fas fa-cut' },
      { id: 3, name: 'Nail Trimming', desc: "Professional nail trimming and filing to keep your pet's nails at the perfect length.", icon: 'fas fa-cut' },
      { id: 4, name: 'Ear Cleaning', desc: 'Gentle ear cleaning and inspection to prevent infections and maintain ear health.', icon: 'fas fa-ear-listen' },
      { id: 5, name: 'Thorough Brushing', desc: 'Complete brushing to remove loose fur, prevent matting, and distribute natural oils.', icon: 'fas fa-brush' },
      { id: 6, name: 'Professional Drying', desc: 'Complete drying with professional equipment to ensure your pet is comfortable and warm.', icon: 'fas fa-sun' }
    ],
    process: [
      { step: 1, name: 'Health Check', desc: 'We start with a gentle health and temperament assessment to ensure your pet is comfortable.' },
      { step: 2, name: 'Pre-Bath Prep', desc: 'Nail trimming, ear cleaning, and thorough brushing to prepare for the bath.' },
      { step: 3, name: 'Luxurious Bath', desc: 'Warm water bath with premium shampoo and conditioning treatment.' },
      { step: 4, name: 'Professional Drying', desc: 'Complete drying and final brushing to leave your pet looking and feeling their best.' }
    ],
    addons: [
      { id: 'aromatherapy', name: 'Aromatherapy Treatment', price: 10, desc: 'Relaxing lavender-scented bath for anxious or stressed pets. Helps calm and soothe your pet during the grooming process.', icon: 'fas fa-spa' },
      { id: 'deshedding', name: 'De-Shedding Treatment', price: 15, desc: 'Special treatment to reduce shedding for heavy-shedding breeds. Removes loose undercoat and reduces shedding by up to 90%.', icon: 'fas fa-heart' },
      { id: 'teeth', name: 'Teeth Cleaning', price: 20, desc: "Professional teeth cleaning to maintain oral health. Helps prevent dental disease and freshens your pet's breath.", icon: 'fas fa-tooth' }
    ]
  },
  'haircut': {
    name: 'Professional Haircut',
    tag: 'Styling Service',
    desc: 'Our expert groomers provide precision haircuts tailored to your pet\'s breed and your preferences. We use professional-grade tools and techniques to ensure a comfortable, stylish result every time.',
    basePrice: 35,
    duration: '30-45',
    included: [
      { id: 1, name: 'Breed-Appropriate Cut', desc: 'Precision cutting tailored to your pet\'s breed standards and your personal preferences.', icon: 'fas fa-cut' },
      { id: 2, name: 'Face & Paw Trimming', desc: 'Detailed trimming around the face, ears, and paws for a polished finish.', icon: 'fas fa-paw' },
      { id: 3, name: 'Pre-Cut Brushing', desc: 'Thorough brushing to remove tangles and mats before cutting begins.', icon: 'fas fa-brush' },
      { id: 4, name: 'Sanitary Trim', desc: 'Hygienic trimming for cleanliness and comfort around sensitive areas.', icon: 'fas fa-shield-alt' },
      { id: 5, name: 'Finishing Spray', desc: 'Light conditioning spray to add shine and keep the coat looking fresh.', icon: 'fas fa-spray-can' },
      { id: 6, name: 'Style Consultation', desc: 'Discuss your preferred style and get expert recommendations for your pet\'s coat type.', icon: 'fas fa-comments' }
    ],
    process: [
      { step: 1, name: 'Consultation', desc: 'Discuss the desired style and assess your pet\'s coat condition.' },
      { step: 2, name: 'Prep & Brush', desc: 'Thorough brushing to detangle and prepare the coat for cutting.' },
      { step: 3, name: 'Precision Cut', desc: 'Expert cutting using professional tools for a clean, even finish.' },
      { step: 4, name: 'Final Touches', desc: 'Detail work on face, paws, and tail, plus finishing spray.' }
    ],
    addons: [
      { id: 'color-chalk', name: 'Creative Color Chalk', price: 10, desc: 'Fun, pet-safe color chalk accents for a unique, eye-catching look.', icon: 'fas fa-palette' },
      { id: 'deep-condition', name: 'Deep Conditioning', price: 12, desc: 'Intensive conditioning treatment to restore moisture and shine to dry or damaged coats.', icon: 'fas fa-tint' },
      { id: 'bandana', name: 'Bandana & Bow', price: 5, desc: 'Adorable finishing touch with a stylish bandana or bow to complete the look.', icon: 'fas fa-gift' }
    ]
  },
  'nail-care': {
    name: 'Nail Care',
    tag: 'Essential Service',
    desc: 'Keep your pet comfortable and healthy with our professional nail care service. Our gentle approach ensures a stress-free experience, with careful trimming and filing for perfectly maintained nails.',
    basePrice: 20,
    duration: '15-25',
    included: [
      { id: 1, name: 'Nail Trimming', desc: 'Precise trimming to the ideal length for your pet\'s comfort and mobility.', icon: 'fas fa-cut' },
      { id: 2, name: 'Nail Filing', desc: 'Smooth filing after trimming to eliminate sharp edges and prevent snagging.', icon: 'fas fa-file' },
      { id: 3, name: 'Paw Inspection', desc: 'Careful examination of paw pads for cracks, dryness, or foreign objects.', icon: 'fas fa-search' },
      { id: 4, name: 'Paw Pad Moisturizing', desc: 'Application of pet-safe moisturizer to keep paw pads soft and healthy.', icon: 'fas fa-tint' }
    ],
    process: [
      { step: 1, name: 'Paw Assessment', desc: 'Inspect nails and paw pads for any issues or sensitivities.' },
      { step: 2, name: 'Gentle Trimming', desc: 'Careful trimming using professional clippers appropriate for your pet\'s nail type.' },
      { step: 3, name: 'Filing & Smoothing', desc: 'Filing nails smooth to prevent scratching or snagging.' },
      { step: 4, name: 'Paw Care', desc: 'Moisturize paw pads and final comfort check.' }
    ],
    addons: [
      { id: 'nail-polish', name: 'Pet-Safe Nail Polish', price: 8, desc: 'Fun, non-toxic nail polish in a variety of colors for a stylish finishing touch.', icon: 'fas fa-paint-brush' },
      { id: 'paw-massage', name: 'Paw Massage', price: 10, desc: 'Relaxing massage to improve circulation and relieve tension in your pet\'s paws.', icon: 'fas fa-hand-holding-heart' }
    ]
  },
  'aromatherapy': {
    name: 'Luxury Aromatherapy Bath',
    tag: 'Spa Experience',
    desc: 'Indulge your pet in a calming aromatherapy bath experience. Using carefully selected essential oils and premium products, this treatment promotes relaxation, reduces anxiety, and leaves your pet\'s coat incredibly soft and fragrant.',
    basePrice: 55,
    duration: '60-75',
    included: [
      { id: 1, name: 'Essential Oil Selection', desc: 'Custom blend of pet-safe essential oils chosen for your pet\'s specific needs.', icon: 'fas fa-flask' },
      { id: 2, name: 'Warm Towel Wrap', desc: 'Soothing warm towel wrap to help your pet relax during the treatment.', icon: 'fas fa-blanket' },
      { id: 3, name: 'Deep Conditioning', desc: 'Intensive conditioning treatment infused with essential oils for a luxuriously soft coat.', icon: 'fas fa-tint' },
      { id: 4, name: 'Calming Massage', desc: 'Gentle massage to reduce stress and promote relaxation throughout the session.', icon: 'fas fa-hand-holding-heart' },
      { id: 5, name: 'Premium Rinse', desc: 'Thorough rinse with temperature-controlled water to remove all product residue.', icon: 'fas fa-shower' },
      { id: 6, name: 'Finishing Touch', desc: 'Light finishing spray with a calming scent that lasts for days.', icon: 'fas fa-spray-can' }
    ],
    process: [
      { step: 1, name: 'Mood Assessment', desc: 'Evaluate your pet\'s stress level and select the appropriate essential oil blend.' },
      { step: 2, name: 'Warm Soak', desc: 'Gentle warm water soak infused with calming essential oils.' },
      { step: 3, name: 'Aromatherapy Wash', desc: 'Premium shampoo and deep conditioning with essential oil treatment.' },
      { step: 4, name: 'Relaxation Finish', desc: 'Warm towel wrap, gentle massage, and professional drying.' }
    ],
    addons: [
      { id: 'extended-massage', name: 'Extended Massage', price: 15, desc: 'Additional 15-minute relaxation massage for extra stress relief.', icon: 'fas fa-spa' },
      { id: 'coat-perfume', name: 'Coat Perfume', price: 8, desc: 'Long-lasting, pet-safe fragrance to keep your pet smelling wonderful.', icon: 'fas fa-wind' }
    ]
  },
  'breed-styling': {
    name: 'Breed-Specific Styling',
    tag: 'Specialist Service',
    desc: 'Our breed-specialist groomers are trained in the specific grooming standards for hundreds of breeds. Whether your pet needs a show-quality cut or a practical everyday style, we deliver breed-appropriate results.',
    basePrice: 65,
    duration: '60-90',
    included: [
      { id: 1, name: 'Breed Standard Cut', desc: 'Precise cutting following established breed grooming standards and guidelines.', icon: 'fas fa-star' },
      { id: 2, name: 'Coat Analysis', desc: 'In-depth analysis of your pet\'s coat type, texture, and condition.', icon: 'fas fa-search' },
      { id: 3, name: 'Hand Stripping', desc: 'Traditional hand-stripping technique for wire-coated breeds when appropriate.', icon: 'fas fa-hand-paper' },
      { id: 4, name: 'Finishing Products', desc: 'Premium breed-specific finishing products for the perfect look.', icon: 'fas fa-spray-can' },
      { id: 5, name: 'Full Bath & Dry', desc: 'Complete bathing and professional drying before styling begins.', icon: 'fas fa-bath' },
      { id: 6, name: 'Photo Documentation', desc: 'Before and after photos to document the grooming results.', icon: 'fas fa-camera' }
    ],
    process: [
      { step: 1, name: 'Breed Assessment', desc: 'Evaluate coat condition and discuss breed-specific styling options.' },
      { step: 2, name: 'Bath & Prep', desc: 'Full bath with breed-appropriate products and thorough drying.' },
      { step: 3, name: 'Expert Styling', desc: 'Precision cutting and styling following breed standards.' },
      { step: 4, name: 'Final Review', desc: 'Quality check and finishing touches for a perfect result.' }
    ],
    addons: [
      { id: 'show-prep', name: 'Show Preparation', price: 25, desc: 'Competition-grade finishing for dog shows and competitions.', icon: 'fas fa-trophy' },
      { id: 'coat-treatment', name: 'Coat Enhancement', price: 15, desc: 'Special treatment to enhance coat texture and shine for your breed.', icon: 'fas fa-magic' }
    ]
  },
  'paw-spa': {
    name: 'Paw & Nail Spa',
    tag: 'Relaxation Service',
    desc: 'A complete paw pampering experience that goes beyond basic nail care. Your pet will enjoy a soothing paw soak, moisturizing treatment, and expert nail care for healthy, comfortable paws.',
    basePrice: 30,
    duration: '25-35',
    included: [
      { id: 1, name: 'Paw Soak', desc: 'Warm, soothing paw soak to soften nails and relax your pet.', icon: 'fas fa-water' },
      { id: 2, name: 'Nail Trimming & Filing', desc: 'Expert nail trimming and smooth filing for perfect length.', icon: 'fas fa-cut' },
      { id: 3, name: 'Pad Treatment', desc: 'Moisturizing and healing treatment for dry or cracked paw pads.', icon: 'fas fa-paw' },
      { id: 4, name: 'Between-Toe Grooming', desc: 'Careful trimming of fur between toes for comfort and hygiene.', icon: 'fas fa-brush' }
    ],
    process: [
      { step: 1, name: 'Inspection', desc: 'Thorough inspection of paws, nails, and paw pads for any issues.' },
      { step: 2, name: 'Warm Soak', desc: 'Relaxing warm water soak with soothing additives.' },
      { step: 3, name: 'Nail Care', desc: 'Professional trimming and filing to the perfect length.' },
      { step: 4, name: 'Moisturize', desc: 'Paw pad moisturizing treatment and between-toe grooming.' }
    ],
    addons: [
      { id: 'paw-wax', name: 'Paw Wax Protection', price: 10, desc: 'Protective wax application to shield paw pads from hot pavement and rough surfaces.', icon: 'fas fa-shield-alt' },
      { id: 'nail-art', name: 'Nail Art', price: 12, desc: 'Creative, pet-safe nail art designs for a fun, unique look.', icon: 'fas fa-palette' }
    ]
  },
  'dental': {
    name: 'Dental Care Package',
    tag: 'Health Service',
    desc: 'Maintain your pet\'s oral health with our comprehensive dental care package. Our gentle approach makes teeth cleaning a positive experience while helping prevent dental disease and freshening breath.',
    basePrice: 40,
    duration: '30-45',
    included: [
      { id: 1, name: 'Teeth Brushing', desc: 'Thorough brushing with pet-safe enzymatic toothpaste for clean, healthy teeth.', icon: 'fas fa-tooth' },
      { id: 2, name: 'Gum Inspection', desc: 'Careful examination of gums for signs of disease, inflammation, or irritation.', icon: 'fas fa-search' },
      { id: 3, name: 'Breath Freshening', desc: 'Natural breath freshening treatment for long-lasting freshness.', icon: 'fas fa-wind' },
      { id: 4, name: 'Dental Report', desc: 'Detailed report of dental findings with recommendations for ongoing care.', icon: 'fas fa-clipboard-list' }
    ],
    process: [
      { step: 1, name: 'Oral Exam', desc: 'Comprehensive examination of teeth, gums, and oral cavity.' },
      { step: 2, name: 'Gentle Cleaning', desc: 'Careful teeth brushing with enzymatic toothpaste.' },
      { step: 3, name: 'Freshening', desc: 'Breath freshening treatment and oral rinse.' },
      { step: 4, name: 'Report & Tips', desc: 'Provide dental health report and at-home care recommendations.' }
    ],
    addons: [
      { id: 'dental-chew', name: 'Dental Chew Pack', price: 8, desc: 'Take-home pack of dental chews to maintain oral health between visits.', icon: 'fas fa-bone' },
      { id: 'oral-spray', name: 'Oral Health Spray', price: 12, desc: 'Pet-safe oral health spray for daily use at home.', icon: 'fas fa-spray-can' }
    ]
  },
  'deshedding': {
    name: 'De-shedding Treatment',
    tag: 'Coat Care',
    desc: 'Our specialized de-shedding treatment reduces loose fur by up to 90%. Using professional tools and techniques, we remove loose undercoat while preserving the healthy topcoat, keeping your home fur-free and your pet comfortable.',
    basePrice: 50,
    duration: '45-60',
    included: [
      { id: 1, name: 'De-shedding Shampoo', desc: 'Specialized shampoo formulated to loosen dead undercoat and reduce shedding.', icon: 'fas fa-flask' },
      { id: 2, name: 'Undercoat Removal', desc: 'Professional de-shedding tools to safely remove loose undercoat.', icon: 'fas fa-brush' },
      { id: 3, name: 'Conditioning Treatment', desc: 'Moisturizing conditioner to nourish the remaining coat and reduce future shedding.', icon: 'fas fa-tint' },
      { id: 4, name: 'High-Velocity Drying', desc: 'Professional drying that helps remove additional loose fur during the process.', icon: 'fas fa-wind' },
      { id: 5, name: 'Final Brushout', desc: 'Thorough final brushing to ensure all loose fur has been removed.', icon: 'fas fa-check-circle' }
    ],
    process: [
      { step: 1, name: 'Coat Assessment', desc: 'Evaluate coat type, thickness, and shedding level to customize the treatment.' },
      { step: 2, name: 'De-shed Bath', desc: 'Specialized shampoo bath to loosen dead undercoat.' },
      { step: 3, name: 'Professional Removal', desc: 'Expert de-shedding using specialized tools and techniques.' },
      { step: 4, name: 'Finish & Condition', desc: 'Conditioning treatment and final brushout for a smooth, shed-free coat.' }
    ],
    addons: [
      { id: 'omega-treatment', name: 'Omega Oil Treatment', price: 12, desc: 'Omega-3 and Omega-6 oil treatment to promote healthy coat growth and reduce shedding.', icon: 'fas fa-fish' },
      { id: 'lint-roller', name: 'Take-Home Lint Roller', price: 5, desc: 'Professional-grade lint roller to keep your clothes and furniture fur-free.', icon: 'fas fa-gift' }
    ]
  },
  'flea-tick': {
    name: 'Flea & Tick Treatment',
    tag: 'Preventive Care',
    desc: 'Protect your pet from harmful parasites with our comprehensive flea and tick treatment. Our medicated bath and thorough inspection ensure complete parasite removal, while preventative treatments keep your pet protected.',
    basePrice: 45,
    duration: '45-60',
    included: [
      { id: 1, name: 'Medicated Bath', desc: 'Specialized anti-parasitic shampoo bath to eliminate fleas and ticks on contact.', icon: 'fas fa-bath' },
      { id: 2, name: 'Full Body Inspection', desc: 'Thorough head-to-tail inspection to locate and remove all parasites.', icon: 'fas fa-search' },
      { id: 3, name: 'Preventative Application', desc: 'Application of veterinarian-approved preventative treatment.', icon: 'fas fa-shield-alt' },
      { id: 4, name: 'Skin Soothing', desc: 'Calming treatment for any skin irritation caused by flea or tick bites.', icon: 'fas fa-hand-holding-heart' },
      { id: 5, name: 'Environmental Tips', desc: 'Guidance on treating your home environment to prevent re-infestation.', icon: 'fas fa-home' }
    ],
    process: [
      { step: 1, name: 'Inspection', desc: 'Thorough examination to assess the level of infestation.' },
      { step: 2, name: 'Medicated Bath', desc: 'Anti-parasitic shampoo treatment to eliminate existing parasites.' },
      { step: 3, name: 'Manual Removal', desc: 'Careful manual removal of any remaining parasites.' },
      { step: 4, name: 'Prevention', desc: 'Apply preventative treatment and provide at-home care guidance.' }
    ],
    addons: [
      { id: 'flea-collar', name: 'Flea & Tick Collar', price: 20, desc: 'Long-lasting flea and tick collar for ongoing protection up to 8 months.', icon: 'fas fa-ring' },
      { id: 'home-spray', name: 'Home Treatment Spray', price: 15, desc: 'Pet-safe spray to treat your home environment and prevent re-infestation.', icon: 'fas fa-spray-can' }
    ]
  }
};

const defaultServiceKey = 'full-bath';

export default function ServiceDetails() {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  const serviceKey = allServicesData[serviceParam] ? serviceParam : defaultServiceKey;
  const service = allServicesData[serviceKey];

  const [selectedAddons, setSelectedAddons] = useState([]);

  const toggleAddon = (id) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const calculateTotalPrice = () => {
    let total = service.basePrice;
    service.addons.forEach((addon) => {
      if (selectedAddons.includes(addon.id)) {
        total += addon.price;
      }
    });
    return total;
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
              <Link to={`/service-booking?service=${serviceKey}`} className="btn">
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
    </div>
  );
}
