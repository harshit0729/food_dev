import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Loader from '../components/ui/Loader';
import { FiChevronLeft, FiPackage, FiMapPin, FiCreditCard } from 'react-icons/fi';

const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

const statusLabels = {
  pending: 'Order Placed', confirmed: 'Confirmed', preparing: 'Preparing',
  ready: 'Ready', out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getById(id);
        setOrder(data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <div className="text-center py-16"><p>Order not found</p></div>;

  const currentStep = statusFlow.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="flex items-center text-gray-500 hover:text-primary-500 mb-6">
        <FiChevronLeft /> <span className="ml-1">Back to Orders</span>
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order._id.slice(-8)}</h1>
            <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
          }`}>
            {statusLabels[order.status]}
          </span>
        </div>

        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {statusFlow.map((s, i) => (
                <div key={s} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= currentStep ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>{i + 1}</div>
                  <p className={`text-xs mt-1 ${i <= currentStep ? 'text-primary-500 font-medium' : 'text-gray-400'}`}>
                    {statusLabels[s]}
                  </p>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700" />
              <div className="absolute top-0 left-4 h-0.5 bg-primary-500 transition-all duration-500"
                style={{ width: `${(currentStep / (statusFlow.length - 1)) * 100}%` }} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start space-x-2">
            <FiPackage className="text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Restaurant</p>
              <p className="font-medium text-gray-900 dark:text-white">{order.restaurant?.name}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <FiMapPin className="text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-medium text-gray-900 dark:text-white">{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <FiCreditCard className="text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Payment</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">{order.paymentMethod} • {order.paymentStatus}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estimated Delivery</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.estimatedDeliveryTime}</p>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.quantity}x</span>
                <span className="text-gray-800 dark:text-gray-200">{item.name}</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm text-gray-500"><span>Delivery Fee</span><span>₹{order.deliveryFee?.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm text-gray-500"><span>Tax</span><span>₹{order.tax?.toFixed(2)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{order.discount}</span></div>}
          <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white"><span>Total</span><span>₹{order.total?.toFixed(2)}</span></div>
        </div>
      </div>

      {order.statusHistory?.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Timeline</h2>
          <div className="space-y-3">
            {[...order.statusHistory].reverse().map((h, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{h.status?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-500">{new Date(h.timestamp).toLocaleString()}</p>
                  {h.note && <p className="text-xs text-gray-400">{h.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
