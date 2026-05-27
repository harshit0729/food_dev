import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { foodAPI, reviewAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { FiStar, FiShoppingCart, FiClock, FiChevronLeft } from 'react-icons/fi';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

const FoodDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, revRes] = await Promise.all([
          foodAPI.getById(id),
          reviewAPI.getAll({ foodItem: id, limit: 10 }),
        ]);
        setItem(foodRes.data.data);
        setReviews(revRes.data.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try { await addToCart(id, quantity); } catch {} finally { setAdding(false); }
  };

  if (loading) return <Loader />;
  if (!item) return <div className="text-center py-16"><p className="text-gray-500">Food item not found</p></div>;

  const { nutritionalInfo, restaurant } = item;
  const price = item.discountPrice || item.price;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to={restaurant ? `/restaurants/${restaurant._id}` : '/restaurants'} className="flex items-center text-gray-500 hover:text-primary-500 mb-6">
        <FiChevronLeft /> <span className="ml-1">Back</span>
      </Link>

      <div className="card overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 flex items-center justify-center">
            <span className="text-8xl">{item.isVegetarian ? '🥬' : '🍗'}</span>
          </div>
          <div className="p-6 md:p-8 md:w-1/2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{item.name}</h1>
                {restaurant && (
                  <Link to={`/restaurants/${restaurant._id}`} className="text-sm text-primary-500 hover:text-primary-600">
                    {restaurant.name}
                  </Link>
                )}
              </div>
              <div className="flex items-center text-yellow-500">
                <FiStar className="fill-current" />
                <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">{item.rating?.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>

            <div className="flex items-center space-x-2 mb-4">
              {item.isVegetarian && <span className="badge-success">Vegetarian</span>}
              {item.isVegan && <span className="badge-success">Vegan</span>}
              {item.isGlutenFree && <span className="badge-success">Gluten Free</span>}
              {item.spiceLevel !== 'mild' && <span className="badge-warning">{item.spiceLevel}</span>}
            </div>

            {nutritionalInfo && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['Calories', 'Protein', 'Carbs', 'Fat', 'Fiber'].map((label) => {
                  const key = label.toLowerCase();
                  const value = nutritionalInfo[key];
                  if (!value && value !== 0) return null;
                  return (
                    <div key={key} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{value}{key === 'calories' ? '' : 'g'}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center space-x-2 mb-4">
              {item.ingredients?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.map((ing, i) => (
                    <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">{ing}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">₹{price}</span>
                {item.discountPrice && <span className="ml-2 text-lg text-gray-400 line-through">₹{item.price}</span>}
              </div>
              {restaurant && <span className="flex items-center text-sm text-gray-500"><FiClock className="mr-1" /> {restaurant.deliveryTime}</span>}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">-</button>
                <span className="px-4 py-2 font-medium text-gray-900 dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={adding} className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3">
                <FiShoppingCart />
                <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews ({reviews.length})</h2>
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
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => <FiStar key={i} className={`text-sm ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetail;
