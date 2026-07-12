import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import * as petApi from '../api/petApi';

export default function PetDetails() {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get('id');
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!petId) {
      navigate('/pets');
      return;
    }

    const fetchPetDetails = async () => {
      try {
        const res = await petApi.getPet(petId);
        if (res?.success && res.data) {
          setPet(res.data);
        }
      } catch (err) {
        console.error('Error fetching pet details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPetDetails();
  }, [petId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        <div className="text-center">
          <i className="fas fa-spinner animate-spin text-4xl text-primary mb-4"></i>
          <p>Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-4">
        <span>Pet profile not found</span>
        <Link to="/pets" className="btn text-sm">Back to Available Pets</Link>
      </div>
    );
  }

  const handleAdoptClick = () => {
    navigate(`/adoption?petType=${pet.type}&breed=${encodeURIComponent(pet.breed || '')}&size=${pet.size || ''}&gender=${pet.gender || ''}`);
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">Meet {pet.name}</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="flex items-center">
                <Link to="/pets" className="hover:text-primary">Pets</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">{pet.name}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pet Details Profile */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 gap-8 items-start">
            {/* Left: Image Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-2xl relative">
                <img
                  src={pet.image || (pet.type === 'cat' ? '/assets/images/pet-2.png' : '/assets/images/pet-1.png')}
                  alt={pet.name}
                  className="w-full object-cover aspect-square hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute top-4 start-4 flex gap-2">
                  <span className="bg-primary/95 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full shadow">
                    {pet.gender}
                  </span>
                  <span className="bg-dark/95 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full shadow">
                    {pet.size}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-bold text-xs uppercase leading-none mb-3">
                  {pet.status}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold font-quicksand text-dark mb-2">{pet.name}</h2>
                <p className="text-lg text-primary font-bold">{pet.breed} • {pet.age}</p>
              </div>

              <hr className="border-gray-100" />

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                  <div className="text-gray-400 text-xs mb-1 uppercase font-bold">Species</div>
                  <div className="text-dark font-bold font-quicksand capitalize text-base">{pet.type}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                  <div className="text-gray-400 text-xs mb-1 uppercase font-bold">Gender</div>
                  <div className="text-dark font-bold font-quicksand capitalize text-base">{pet.gender || 'Unknown'}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                  <div className="text-gray-400 text-xs mb-1 uppercase font-bold">Size</div>
                  <div className="text-dark font-bold font-quicksand capitalize text-base">{pet.size || 'Medium'}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                  <div className="text-gray-400 text-xs mb-1 uppercase font-bold">Adoption Fee</div>
                  <div className="text-primary font-bold font-quicksand text-base">
                    {pet.price ? `$${pet.price.toLocaleString()}` : '$0 (Free)'}
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-quicksand text-dark">About {pet.name}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {pet.description || `${pet.name} is a wonderful ${pet.breed || pet.type} searching for a forever family. Highly active, social, and friendly with children and other household pets. Fully health checked, microchipped, and vaccinated.`}
                </p>
              </div>

              {/* Health Guarantee checklist */}
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-3">
                <h4 className="font-bold text-dark font-quicksand text-base">Pet Adoption Checklist:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 font-semibold">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-primary text-base"></i>
                    <span>Fully Vaccinated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-primary text-base"></i>
                    <span>Spayed/Neutered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-primary text-base"></i>
                    <span>Behavioral Checked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-primary text-base"></i>
                    <span>Dewormed & Defleaed</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleAdoptClick}
                  className="btn flex items-center justify-center gap-2 px-8 py-4 text-base"
                >
                  <i className="fas fa-heart"></i>
                  Adopt {pet.name}
                </button>
                <Link to="/pets" className="btn btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-base">
                  <i className="fas fa-arrow-left"></i>
                  View Other Pets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
