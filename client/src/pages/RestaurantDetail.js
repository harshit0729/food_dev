import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantAPI, reviewAPI } from '../services/api';
import FoodCard from '../components/ui/FoodCard';
import Loader from '../components/ui/Loader';
import { FiStar, FiClock, FiTruck, FiMapPin } from 'react-icons/fi';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, revRes] = await Promise.all([
          restaurantAPI.getById(id),
          reviewAPI.getAll({ restaurant: id, limit: 5 }),
        ]);
        setData(restRes.data.data);
        setReviews(revRes.data.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (!data) return <div className="text-center py-16"><p className="text-gray-500">Restaurant not found</p></div>;

  const { restaurant, menuItems } = data;
  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];
  const filteredItems = activeCategory === 'All' ? menuItems : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-primary-500 to-secondary-500 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-6 text-white">
            <h1 className="text-3xl font-bold mb-1">{restaurant.name}</h1>
            <p className="text-white/80">{restaurant.description}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center text-yellow-500"><FiStar className="mr-1 fill-current" /> {restaurant.rating?.toFixed(1)} ({restaurant.totalRatings})</div>
            <div className="flex items-center text-gray-500 dark:text-gray-400"><FiClock className="mr-1" /> {restaurant.deliveryTime}</div>
            <div className="flex items-center text-gray-500 dark:text-gray-400"><FiTruck className="mr-1" /> ₹{restaurant.deliveryFee}</div>
            <div className="flex items-center text-gray-500 dark:text-gray-400"><FiMapPin className="mr-1" /> {restaurant.address?.city}</div>
            <span className="font-medium text-gray-700 dark:text-gray-300">{restaurant.priceRange}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${restaurant.isOpen ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {restaurant.cuisine?.map((c, i) => <span key={i} className="badge-primary">{c}</span>)}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Menu</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredItems.map((item) => <FoodCard key={item._id} item={item} />)}
      </div>

      {reviews.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-sm">
                      {review.user?.name?.[0]}
                    </div>
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{review.user?.name}</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`text-sm ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                {review.title && <p className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-1">{review.title}</p>}
                <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
