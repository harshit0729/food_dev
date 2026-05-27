import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiPlus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const FoodCard = ({ item }) => {
  const { addToCart } = useCart();

  const discountPercent = item.discountPrice
    ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
    : 0;

  return (
    <div className="card group">
      <div className="relative overflow-hidden h-44">
        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 flex items-center justify-center">
          <span className="text-4xl">{item.isVegetarian ? '🥬' : '🍗'}</span>
        </div>
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discountPercent}% OFF
          </span>
        )}
        {item.isFeatured && (
          <span className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
        <button
          onClick={() => addToCart(item._id)}
          className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary-500 hover:text-white"
        >
          <FiPlus className="text-lg" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <Link to={`/food/${item._id}`}>
            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">
              {item.name}
            </h3>
          </Link>
          <div className="flex items-center space-x-1 text-yellow-500">
            <FiStar className="text-sm fill-current" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.rating?.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{item.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {item.discountPrice ? (
              <>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{item.discountPrice}</span>
                <span className="text-sm text-gray-400 line-through">₹{item.price}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{item.price}</span>
            )}
          </div>
          {item.restaurant && (
            <span className="text-xs text-gray-400 flex items-center">
              <FiClock className="mr-1" />
              {item.restaurant.deliveryTime}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-2">
          {item.isVegetarian && <span className="badge-success text-xs">Veg</span>}
          {item.isVegan && <span className="badge-success text-xs">Vegan</span>}
          {item.spiceLevel !== 'mild' && (
            <span className="badge-warning text-xs">{item.spiceLevel}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
