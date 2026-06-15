import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import StarRating from '../UI/StarRating';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonialsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Dog Parent',
    rating: 5,
    text: '"Excellent service! My Golden Retriever Max looks amazing after every visit. The staff is so caring and professional. They always remember his preferences and make him feel comfortable."',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Cat Parent',
    rating: 5,
    text: '"I was nervous about getting my Persian cat Luna groomed, but the team here made it a wonderful experience. They\'re incredibly patient and gentle with her. The luxury spa treatment was amazing"',
  }
];

export default function TestimonialSwiper() {
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
          el: '.testimonial-pagination',
        }}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        speed={500}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
        className="testimonial-swiper"
      >
        {testimonialsData.map((t) => (
          <SwiperSlide key={t.id}>
            <div className="relative z-[1] md:p-12 p-10 !pb-24 text-center h-full flex flex-col justify-between">
              <img
                className="absolute inset-0 h-full w-full z-[-1]"
                src="/assets/images/testimonial-card-bg.png"
                alt="testimonial-bg"
              />
              <div className="flex justify-center mb-4">
                <StarRating rating={t.rating} />
              </div>
              <p className="lg:text-lg text-gray-600 mb-5 line-clamp-4 leading-relaxed">
                {t.text}
              </p>
              <div>
                <h3 className="text-xl mb-1 font-bold font-quicksand text-dark">{t.name}</h3>
                <div className="text-gray-500 text-sm">{t.role}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Pagination indicators */}
      <div className="testimonial-pagination swiper-pagination !bottom-0"></div>
    </div>
  );
}
