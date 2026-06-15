import React from 'react';
import { Link } from 'react-router-dom';
import Accordion from '../components/UI/Accordion';

export default function FAQ() {
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
            {/* Grooming Services FAQ */}
            <div className="lg:mb-12 mb-8">
              <div className="flex items-center lg:mb-8 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center me-4 text-white shadow-md">
                  <i className="fas fa-cut text-base"></i>
                </div>
                <h2 className="text-2xl font-bold font-quicksand text-dark">Grooming Services</h2>
              </div>
              <div className="space-y-5">
                <Accordion title="How long does a full grooming session take?">
                  A full grooming session typically takes 2-3 hours depending on your pet's size, coat condition, and the services requested. We take our time to ensure your pet is comfortable and receives the best possible care. For anxious pets, we may need additional time to help them relax.
                </Accordion>
                <Accordion title="What grooming services do you offer for dogs?">
                  Our dog grooming services include bath and brush, full haircuts, nail trimming, ear cleaning, teeth brushing, de-shedding treatments, and specialized skin treatments. We also offer breed-specific styling and can accommodate special needs for senior dogs or those with skin sensitivities.
                </Accordion>
                <Accordion title="Do you offer grooming services for cats?">
                  Yes, we offer specialized cat grooming services including bathing, nail trimming, ear cleaning, lion cuts, and de-shedding treatments. Our groomers are trained to handle cats with care and patience, and we use cat-specific products that are gentle on their sensitive skin. We also provide a calm environment to minimize stress for your feline friend.
                </Accordion>
              </div>
            </div>

            {/* Boarding & Daycare FAQ */}
            <div className="lg:mb-12 mb-8">
              <div className="flex items-center lg:mb-8 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center me-4 text-white shadow-md">
                  <i className="fas fa-home text-base"></i>
                </div>
                <h2 className="text-2xl font-bold font-quicksand text-dark">Boarding & Daycare</h2>
              </div>
              <div className="space-y-5">
                <Accordion title="What are your boarding facilities like?">
                  Our boarding facilities feature spacious, climate-controlled kennels with comfortable bedding. Dogs get multiple outdoor play sessions daily in our secure play yards, while cats enjoy multi-level condos with climbing spaces. We provide 24/7 supervision, regular feeding schedules based on your pet's routine, and administration of any required medications. Our facility is designed to minimize stress and maximize comfort for all pets.
                </Accordion>
                <Accordion title="What does pet daycare include?">
                  Our pet daycare includes supervised play sessions in groups matched by size, temperament, and energy level. Your pet will enjoy indoor and outdoor play areas with agility equipment, toys, and water features in warm weather. We provide rest periods, fresh water, and optional lunch. Our trained staff monitors all interactions to ensure safety and positive socialization. We also offer enrichment activities like puzzle toys and basic training reinforcement.
                </Accordion>
                <Accordion title="What vaccinations are required for boarding and daycare?">
                  For dogs, we require current vaccinations for Rabies, Distemper/Parvo (DHPP), and Bordetella (kennel cough). For cats, we require Rabies and FVRCP (feline distemper). All pets must be free of fleas, ticks, and contagious conditions. We recommend vaccines be administered at least 7 days before boarding or daycare. Please bring your pet's vaccination records on your first visit, and we'll keep them on file for future stays.
                </Accordion>
              </div>
            </div>

            {/* Policies & Booking FAQ */}
            <div className="lg:mb-12 mb-8">
              <div className="flex items-center lg:mb-8 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center me-4 text-white shadow-md">
                  <i className="fas fa-clipboard-list text-base"></i>
                </div>
                <h2 className="text-2xl font-bold font-quicksand text-dark">Policies & Booking</h2>
              </div>
              <div className="space-y-5">
                <Accordion title="How do I book an appointment?">
                  You can book an appointment through our website's online booking system, by calling our customer service line, or by visiting our location in person. For online bookings, select your desired service, preferred date and time, and provide your pet's information. We recommend booking at least 1-2 weeks in advance for grooming services and 2-4 weeks for boarding during peak seasons. Same-day appointments may be available for certain services based on our schedule.
                </Accordion>
                <Accordion title="What is your cancellation policy?">
                  We require at least 24 hours' notice for cancellation of grooming appointments and 48 hours for daycare or boarding reservations. Late cancellations or no-shows may result in a cancellation fee of 50% of the service cost. We understand emergencies happen, so please contact us as soon as possible if you need to reschedule. For holiday boarding cancellations, we require 7 days' notice to receive a full refund of your deposit.
                </Accordion>
                <Accordion title="Do you accept pet insurance?">
                  While we don't directly bill pet insurance companies, we provide detailed receipts and service documentation that you can submit to your pet insurance provider for reimbursement. Many wellness plans cover grooming and preventative care services. We recommend checking with your insurance provider about coverage details before your appointment. We accept all major credit cards, debit cards, and mobile payment options for your convenience.
                </Accordion>
              </div>
            </div>

            {/* Still Have Questions */}
            <div className="lg:mt-12 mt-8 bg-primary/10 rounded-3xl xl:p-10 lg:p-8 p-6 text-center relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="absolute bottom-0 start-0 w-32 h-32 bg-primary/5 rounded-full -ms-16 -mb-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-10">
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
