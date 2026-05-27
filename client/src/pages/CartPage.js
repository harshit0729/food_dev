import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import Loader from '../components/ui/Loader';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) return <Loader />;

  if (!cart || !cart.items?.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add delicious food items from your favorite restaurants</p>
        <Link to="/restaurants" className="btn-primary inline-flex items-center space-x-2">
          <FiArrowLeft /> <span>Browse Restaurants</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear Cart</button>
      </div>

      <div className="lg:flex gap-8">
        <div className="lg:w-2/3 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="card p-4 flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{item.foodItem?.isVegetarian ? '🥬' : '🍗'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/food/${item.foodItem?._id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-500">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">₹{item.price} each</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                  <FiMinus />
                </button>
                <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                  <FiPlus />
                </button>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
              </div>
              <button onClick={() => removeItem(item._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3 mt-6 lg:mt-0">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{cart.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span>₹{cart.deliveryFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (5%)</span>
                <span>₹{cart.tax?.toFixed(2)}</span>
              </div>
              {cart.promoCode?.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{cart.promoCode.discount}</span>
                </div>
              )}
              <hr className="dark:border-gray-700" />
              <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{cart.total?.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-6 py-3">
              Proceed to Checkout
            </button>

            <Link to="/restaurants" className="block text-center text-sm text-primary-500 hover:text-primary-600 mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
