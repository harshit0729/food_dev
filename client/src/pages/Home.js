import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiSearch } from 'react-icons/fi';
import { restaurantAPI, foodAPI } from '../services/api';
import RestaurantCard from '../components/ui/RestaurantCard';
import FoodCard from '../components/ui/FoodCard';
import AIRecommendations from '../components/ai/AIRecommendations';
import Loader from '../components/ui/Loader';

const Home = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, foodRes] = await Promise.all([
          restaurantAPI.getFeatured(),
          foodAPI.getFeatured(),
        ]);
        setFeaturedRestaurants(restRes.data.data || []);
        setFeaturedItems(foodRes.data.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(236,72,153,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Smart Food Delivery{' '}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Get personalized food recommendations, smart search, and AI-powered meal planning — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/restaurants" className="btn-primary text-lg px-8 py-3 flex items-center space-x-2">
                <span>Order Now</span>
                <FiArrowRight />
              </Link>
              <Link to="/ai" className="btn-outline text-lg px-8 py-3 flex items-center space-x-2">
                <FiSearch />
                <span>Try AI Features</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: FiStar, title: 'AI Recommendations', desc: 'Personalized food suggestions based on your mood, budget, and preferences' },
              { icon: FiTruck, title: 'Fast Delivery', desc: 'Quick delivery from the best restaurants near you, tracked in real-time' },
              { icon: FiShield, title: 'Smart Meal Planning', desc: 'AI-powered meal plans for fitness, weight loss, and dietary needs' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="card p-6 text-center hover:border-primary-200 dark:hover:border-primary-800">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Icon className="text-2xl text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Featured Restaurants</h2>
          <Link to="/restaurants" className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center">
            View All <FiArrowRight className="ml-1" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <div key={i} className="card p-4"><div className="h-36 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" /><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" /><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" /></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRestaurants.map((r) => <RestaurantCard key={r._id} restaurant={r} />)}
          </div>
        )}
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Popular Dishes</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <div key={i} className="card p-4"><div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" /><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" /><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" /></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => <FoodCard key={item._id} item={item} />)}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AIRecommendations />
      </section>
    </div>
  );
};

export default Home;
