import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import RestaurantCard from '../components/ui/RestaurantCard';
import Loader from '../components/ui/Loader';
import { FiSearch, FiSliders } from 'react-icons/fi';

const cuisines = ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental', 'Healthy', 'Vegan'];

const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const params = { page: 1, limit: 20 };
        if (search) params.search = search;
        if (selectedCuisine) params.cuisine = selectedCuisine;
        if (sort) params.sort = sort;
        const { data } = await restaurantAPI.getAll(params);
        setRestaurants(data.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetchRestaurants();
  }, [search, selectedCuisine, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">Restaurants</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search restaurants..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field sm:w-40">
          <option value="">Sort By</option>
          <option value="rating">Highest Rated</option>
          <option value="delivery">Lowest Delivery Fee</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setSelectedCuisine('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedCuisine ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>
          All
        </button>
        {cuisines.map((c) => (
          <button key={c} onClick={() => setSelectedCuisine(selectedCuisine === c ? '' : c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCuisine === c ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : restaurants.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No restaurants found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((r) => <RestaurantCard key={r._id} restaurant={r} />)}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
