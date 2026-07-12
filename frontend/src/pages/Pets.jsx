import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as petApi from '../api/petApi';
import { CardSkeleton } from '../components/UI/SkeletonLoader';
import PetCard from '../components/UI/PetCard';

export default function Pets() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('all'); // 'all', 'dog', 'cat', 'other'
  const [genderFilter, setGenderFilter] = useState(''); // '', 'male', 'female'
  const [sizeFilter, setSizeFilter] = useState(''); // '', 'small', 'medium', 'large'

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeType !== 'all') params.type = activeType;
        if (searchTerm.trim() !== '') params.search = searchTerm.trim();
        
        const res = await petApi.getAvailablePets(params);
        if (res?.success && res.data) {
          // Client-side local filtering for gender and size if specified
          let filteredData = res.data;
          if (genderFilter) {
            filteredData = filteredData.filter(pet => pet.gender === genderFilter);
          }
          if (sizeFilter) {
            filteredData = filteredData.filter(pet => pet.size === sizeFilter);
          }
          setPets(filteredData);
        }
      } catch (err) {
        console.error('Error fetching adoptable pets:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add a slight debounce for search term
    const timer = setTimeout(() => {
      fetchPets();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, activeType, genderFilter, sizeFilter]);

  return (
    <div>
      {/* banner */}
      <section
        className="banner-section relative lg:pt-20 pt-10 lg:pb-24 pb-12 bg-cover sm:bg-[right] bg-[80%] rtl:scale-x-[-1]"
        style={{ backgroundImage: "url('/assets/images/common-banner.png')" }}
      >
        <div className="md:container w-full mx-auto px-4 rtl:scale-x-[-1]">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 capitalize font-bold font-quicksand text-dark">Adoptable Pets</h2>
            <ul className="flex flex-wrap items-center capitalize text-sm font-medium text-gray-700">
              <li className="flex items-center">
                <Link to="/" className="hover:text-primary">Home</Link>
                <i className="fas fa-chevron-right mx-2 text-xs rtl:scale-x-[-1] text-gray-400"></i>
              </li>
              <li className="font-bold text-dark">Adoptions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Filter and Cards List */}
      <section className="lg:py-20 py-10 bg-white">
        <div className="md:container w-full mx-auto px-4">
          <div className="text-center lg:mb-12 mb-8">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm leading-none">
                Find Your Pet
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-quicksand text-dark">
              Available For <span className="text-primary">Adoption</span>
            </h2>
          </div>

          {/* Search & Filter Section */}
          <div className="bg-gray-50 rounded-3xl p-6 mb-10 border border-gray-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Search */}
              <div className="relative md:col-span-2">
                <span className="absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by pet name or breed..."
                  className="form-input !ps-12 !py-3 !rounded-2xl"
                />
              </div>

              {/* Gender Filter */}
              <div>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="form-input !py-3 !rounded-2xl"
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="form-input !py-3 !rounded-2xl"
                >
                  <option value="">All Sizes</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            {/* Type tabs */}
            <div className="flex flex-wrap gap-2 border-t pt-6 border-gray-200 justify-center">
              {[
                { id: 'all', label: 'All Pets', icon: 'fas fa-paw' },
                { id: 'dog', label: 'Dogs Only', icon: 'fas fa-dog' },
                { id: 'cat', label: 'Cats Only', icon: 'fas fa-cat' },
                { id: 'other', label: 'Other Pets', icon: 'fas fa-fish' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveType(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition duration-300 ${
                    activeType === tab.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-500 hover:text-dark hover:border-gray-300'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <CardSkeleton />
                </div>
              ))
            ) : pets.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400 font-medium">
                <i className="fas fa-search text-5xl mb-4 opacity-50 block"></i>
                <p>No adoptable pets found matching your filters.</p>
              </div>
            ) : (
              pets.map((pet, idx) => (
                <PetCard key={pet._id} pet={pet} index={idx} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
