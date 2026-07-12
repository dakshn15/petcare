import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Wilson',
    role: 'Founder & Lead Groomer',
    image: '/assets/images/team-1.png'
  },
  {
    id: 2,
    name: 'Mike Thompson',
    role: 'Co-Founder',
    image: '/assets/images/team-2.png'
  },
  {
    id: 3,
    name: 'Jennifer Martinez',
    role: 'Senior Groomer',
    image: '/assets/images/team-3.png'
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'Specialty Stylist',
    image: '/assets/images/team-4.png'
  }
];

export default function TeamSwiper() {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.team-next',
          prevEl: '.team-prev',
        }}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        speed={500}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="team-swiper"
      >
        {teamMembers.map((m) => (
          <SwiperSlide key={m.id}>
            <div className="flex items-end relative z-[1] sm:h-[550px] h-[450px] rounded-full overflow-hidden group">
              <img
                src={m.image}
                alt={m.name}
                className="absolute z-[-1] inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="text-center flex flex-col items-center justify-center w-full md:pt-8 pt-6 md:px-12 px-8 md:pb-16 pb-10 backdrop-blur-md bg-secondary/80 text-white transform transition-all duration-300">
                <h3 className="text-2xl mb-2 font-bold font-quicksand">{m.name}</h3>
                <p className="font-medium text-primary mb-3 text-sm">{m.role}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="arrow-wrapper">
        <div className="swiper-button-prev team-arrow team-prev"></div>
        <div className="swiper-button-next team-arrow team-next"></div>
      </div>
    </div>
  );
}
