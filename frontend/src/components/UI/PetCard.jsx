import React from 'react';
import { Link } from 'react-router-dom';

export default function PetCard({ pet, index }) {
  const idx = typeof index === 'number' ? index : 0;
  
  // Normalize fields so it works with both direct API data and manual objects
  const id = pet._id || pet.id;
  const name = pet.name;
  const breed = pet.breed || 'Unknown Breed';
  const age = pet.age || '3 months old';
  const type = pet.type === 'dog' ? 'Puppy' : pet.type === 'cat' ? 'Kitten' : 'Pet';
  const tag = pet.gender === 'female' ? 'Spayed' : 'Vaccinated';
  const price = pet.price || (idx === 0 ? 800 : idx === 1 ? 600 : 1200);
  const rating = pet.rating || '4.9';
  const reviews = pet.reviews || (idx === 0 ? 120 : idx === 1 ? 85 : 95);
  const image = pet.image || `/assets/images/pet-${(idx % 3) + 1}.png`;
  const desc = pet.description || pet.desc || 'Friendly and playful, fully vaccinated and ready for adoption. Great with families.';
  const status = pet.status || 'Available';
  
  return (
    <div className="flex flex-col h-full bg-white border rounded-2xl overflow-hidden group transition duration-300 hover:shadow-xl transform hover:-translate-y-1.5">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-72 object-cover transform group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-4 end-4 flex gap-2">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
            {type}
          </span>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
            {tag}
          </span>
        </div>
        <div className="absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center text-white text-sm">
            <i className="fas fa-star text-yellow-400 me-2"></i>
            <span className="font-semibold">{rating} ({reviews} reviews)</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col h-full lg:p-6 p-4">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl lg:text-2xl mb-2 font-bold font-quicksand text-dark">
                <Link to={`/pet-details?id=${id}`} className="hover:text-primary transition-colors">
                  {name}
                </Link>
              </h3>
              <div className="flex flex-wrap gap-2 gap-y-1 items-center text-gray-600 text-sm">
                <span className="capitalize">{breed}</span>
                <span>•</span>
                <span>{age}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-extrabold mb-0.5">Adoption Fee</span>
              <span className="text-xl lg:text-2xl font-bold text-primary">${price.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-2 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <i className="fa-regular fa-clock text-sm me-2 text-primary"></i>
              <span>Available Now</span>
            </div>
            <div className="flex items-center text-gray-600">
              <i className="fa-regular fa-circle-check text-sm me-2 text-primary"></i>
              <span>Health Checked</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
            {desc}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center me-3">
              <i className="fa-regular fa-calendar text-base text-primary"></i>
            </div>
            <div className="text-xs">
              <div className="font-semibold text-dark">Status</div>
              <div className="text-gray-600">{status}</div>
            </div>
          </div>
          <Link to={`/pet-details?id=${id}`} className="btn text-sm">
            View Details
            <i className="fas fa-arrow-right rtl:scale-x-[-1]"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
