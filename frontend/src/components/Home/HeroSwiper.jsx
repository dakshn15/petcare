import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSwiper() {
  return (
    <div className="lg:w-1/2 w-full relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        loop={true}
        speed={500}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-hero',
        }}
        className="hero-swiper !p-0 !m-0"
      >
        <SwiperSlide>
          <div className="overflow-hidden xl:h-[500px] lg:h-[300px] h-[250px] w-full lg:border-[12px] lg:border-e-0 border-4 border-primary lg:rounded-s-full rounded-2xl">
            <img src="/assets/images/hero-banner-1.png" className="h-full w-full object-cover" alt="banner-image" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="overflow-hidden xl:h-[500px] lg:h-[300px] h-[250px] w-full lg:border-[12px] lg:border-e-0 border-4 border-primary lg:rounded-s-full rounded-2xl">
            <img src="/assets/images/hero-banner-2.png" className="h-full w-full object-cover" alt="banner-image" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="overflow-hidden xl:h-[500px] lg:h-[300px] h-[250px] w-full lg:border-[12px] lg:border-e-0 border-4 border-primary lg:rounded-s-full rounded-2xl">
            <img src="/assets/images/hero-banner-3.png" className="h-full w-full object-cover" alt="banner-image" />
          </div>
        </SwiperSlide>
      </Swiper>
      
      {/* Pagination wrapper */}
      <div className="swiper-pagination-hero swiper-pagination !bottom-0"></div>
      
      <div className="lg:block hidden banner-label xl:h-40 xl:w-40 lg:h-32 lg:w-32 h-24 w-24 absolute z-[1] -top-6 -start-6 lg:top-0 lg:-start-8 animate-spin-slow">
        <img src="/assets/images/banner-label.png" alt="banner-label" />
      </div>
    </div>
  );
}
