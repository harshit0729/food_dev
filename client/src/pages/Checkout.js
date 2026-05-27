import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    zip: user?.addresses?.[0]?.zip || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [instructions, setInstructions] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.zip) {
      return toast.error('Please fill in complete delivery address');
    }
    setLoading(true);
    try {
      const { data } = await orderAPI.create({
        deliveryAddress: address,
        paymentMethod,
        specialInstructions: instructions,
      });
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/orders/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items?.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="lg:flex gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Street</label>
                <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="input-field" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">City</label>
                <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="input-field" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">State</label>
                <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="input-field" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">ZIP Code</label>
                <input type="text" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="input-field" required />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: 'cash', label: 'Cash on Delivery', desc: 'Pay when your food arrives' },
                { value: 'card', label: 'Debit/Credit Card', desc: 'Secure payment via card' },
                { value: 'upi', label: 'UPI', desc: 'Pay via Google Pay, PhonePe, etc.' },
              ].map(({ value, label, desc }) => (
                <label key={value} className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input type="radio" name="payment" value={value} checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value)} className="mr-3 accent-primary-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Special Instructions</h2>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)}
              className="input-field h-20 resize-none" placeholder="Any special requests for the restaurant?" />
          </div>
        </div>

        <div className="lg:w-1/3 mt-6 lg:mt-0">
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.name} x{item.quantity}</span>
                  <span className="text-gray-900 dark:text-white font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <hr className="dark:border-gray-700 mb-3" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span><span>₹{cart.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery</span><span>₹{cart.deliveryFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span><span>₹{cart.tax?.toFixed(2)}</span>
              </div>
              <hr className="dark:border-gray-700" />
              <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total</span><span>₹{cart.total?.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-6 py-3">
              {loading ? 'Placing Order...' : `Place Order • ₹${cart.total?.toFixed(2)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
