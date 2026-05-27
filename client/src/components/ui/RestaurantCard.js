import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiTruck } from 'react-icons/fi';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurants/${restaurant._id}`} className="card group">
      <div className="relative h-36 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 flex items-center justify-center">
        <span className="text-5xl">🏪</span>
        {restaurant.featured && (
          <span className="absolute top-2 left-2 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
        {restaurant.isOpen ? (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Open
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Closed
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <FiStar className="text-sm fill-current" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{restaurant.rating?.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{restaurant.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.cuisine?.slice(0, 3).map((c, i) => (
            <span key={i} className="badge-primary text-xs">{c}</span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center"><FiTruck className="mr-1" /> ₹{restaurant.deliveryFee}</span>
          <span className="flex items-center"><FiClock className="mr-1" /> {restaurant.deliveryTime}</span>
          <span className="font-medium">{restaurant.priceRange}</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
