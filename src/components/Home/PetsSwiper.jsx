import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const petsData = [
  {
    id: 1,
    name: 'Max',
    breed: 'Golden Retriever',
    age: '3 months old',
    type: 'Puppy',
    tag: 'Vaccinated',
    price: 800,
    rating: '4.9',
    reviews: 120,
    image: '/assets/images/pet-1.png',
    desc: 'Friendly and playful Golden Retriever puppy, fully vaccinated and ready for adoption. Great with children and other pets.',
    updated: '2 days ago'
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Persian Cat',
    age: '2 years old',
    type: 'Adult',
    tag: 'Spayed',
    price: 600,
    rating: '4.8',
    reviews: 85,
    image: '/assets/images/pet-2.png',
    desc: 'Beautiful Persian cat with a gentle temperament, perfect for a quiet home environment. Loves cuddles and is litter trained.',
    updated: '1 day ago'
  },
  {
    id: 3,
    name: 'Rocky',
    breed: 'French Bulldog',
    age: '4 months old',
    type: 'Puppy',
    tag: 'Vaccinated',
    price: 1200,
    rating: '4.9',
    reviews: 95,
    image: '/assets/images/pet-3.png',
    desc: 'Adorable French Bulldog puppy with a playful personality and excellent health. Great with families and other pets.',
    updated: '3 days ago'
  }
];

export default function PetsSwiper() {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.pets-next',
          prevEl: '.pets-prev',
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
            spaceBetween: 32,
          },
        }}
        className="pets-swiper pb-8 -mb-8"
      >
        {petsData.map((pet) => (
          <SwiperSlide key={pet.id}>
            <div className="flex flex-col h-full bg-white border rounded-2xl overflow-hidden group transition duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-72 object-cover transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-4 end-4 flex gap-2">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {pet.type}
                  </span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {pet.tag}
                  </span>
                </div>
                <div className="absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center text-white text-sm">
                    <i className="fas fa-star text-yellow-400 me-2"></i>
                    <span className="font-semibold">{pet.rating} ({pet.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col h-full lg:p-6 p-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl lg:text-2xl mb-2 font-bold font-quicksand text-dark">{pet.name}</h3>
                      <div className="flex flex-wrap gap-2 gap-y-1 items-center text-gray-600 text-sm">
                        <span>{pet.breed}</span>
                        <span>•</span>
                        <span>{pet.age}</span>
                      </div>
                    </div>
                    <div className="text-xl lg:text-2xl font-bold text-primary">${pet.price.toLocaleString()}</div>
                  </div>

                  <div className="flex flex-wrap justify-between gap-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <i className="fa-regular fa-clock me-2 text-primary"></i>
                      <span>Available Now</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fa-regular fa-circle-check me-2 text-primary"></i>
                      <span>Health Checked</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{pet.desc}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center me-3">
                      <i className="fa-regular fa-clock text-base text-primary"></i>
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-dark">Last Updated</div>
                      <div className="text-gray-600">{pet.updated}</div>
                    </div>
                  </div>
                  <Link to="/adoption" className="btn text-sm">
                    Adopt Now
                    <i className="fas fa-arrow-right rtl:scale-x-[-1]"></i>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="arrow-wrapper">
        <div className="swiper-button-prev pets-arrow pets-prev"></div>
        <div className="swiper-button-next pets-arrow pets-next"></div>
      </div>
    </div>
  );
}
