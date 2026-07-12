import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import * as petApi from '../../api/petApi';
import PetCard from '../UI/PetCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function PetsSwiper() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await petApi.getAvailablePets();
        if (res?.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((pet, idx) => ({
            id: pet._id,
            name: pet.name,
            breed: pet.breed,
            age: pet.age || '3 months old',
            type: pet.type === 'dog' ? 'Puppy' : pet.type === 'cat' ? 'Kitten' : 'Pet',
            tag: pet.gender === 'female' ? 'Spayed' : 'Vaccinated',
            price: pet.price || (idx === 0 ? 800 : idx === 1 ? 600 : 1200),
            rating: '4.9',
            reviews: idx === 0 ? 120 : idx === 1 ? 85 : 95,
            image: pet.image || `/assets/images/pet-${(idx % 3) + 1}.png`,
            desc: pet.description || 'Friendly and playful, fully vaccinated and ready for adoption. Great with families.',
            updated: '2 days ago'
          }));
          setPets(mapped);
        } else {
          // Keep fallback static pets if none returned
          setPets(fallbackPets);
        }
      } catch (err) {
        console.error('Error fetching pets:', err);
        setPets(fallbackPets);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const fallbackPets = [
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

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading available pets...</div>;
  }

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
        {pets.map((pet, idx) => (
          <SwiperSlide key={pet.id || pet._id}>
            <PetCard pet={pet} index={idx} />
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
