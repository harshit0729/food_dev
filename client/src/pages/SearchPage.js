import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { foodAPI, restaurantAPI, aiAPI } from '../services/api';
import FoodCard from '../components/ui/FoodCard';
import RestaurantCard from '../components/ui/RestaurantCard';
import Loader from '../components/ui/Loader';
import { FiSearch, FiCpu } from 'react-icons/fi';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!query) { setLoading(false); return; }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const [foodRes, restRes] = await Promise.all([
          foodAPI.getAll({ search: query, limit: 12 }),
          restaurantAPI.getAll({ search: query, limit: 6 }),
        ]);
        setFoods(foodRes.data.data || []);
        setRestaurants(restRes.data.data || []);

        setAiLoading(true);
        try {
          const { data } = await aiAPI.smartSearch({ query });
          setAiSuggestions(data.data || []);
        } catch { setAiSuggestions([]); }
        setAiLoading(false);
      } catch {} finally { setLoading(false); }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-2">Search Results</h1>
      <p className="text-gray-500 mb-8">Showing results for "{query}"</p>

      {aiSuggestions.length > 0 && !aiLoading && (
        <div className="card p-5 mb-8 border-primary-200 dark:border-primary-800">
          <div className="flex items-center space-x-2 mb-4">
            <FiCpu className="text-primary-500 text-xl" />
            <h2 className="font-semibold text-gray-900 dark:text-white">AI Smart Suggestions</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                {typeof s === 'string' ? s : s.name || s}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading ? <Loader /> : (
        <>
          {restaurants.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Restaurants ({restaurants.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((r) => <RestaurantCard key={r._id} restaurant={r} />)}
              </div>
            </div>
          )}

          {foods.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Food Items ({foods.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {foods.map((item) => <FoodCard key={item._id} item={item} />)}
              </div>
            </div>
          )}

          {foods.length === 0 && restaurants.length === 0 && (
            <div className="text-center py-16">
              <FiSearch className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No results found for "{query}"</p>
              <p className="text-gray-400 text-sm mt-2">Try searching for different food items or restaurants</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
