import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Loader from '../components/ui/Loader';
import { FiPackage, FiClock, FiChevronRight } from 'react-icons/fi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  preparing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  ready: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  out_for_delivery: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getAll({ limit: 20 });
        setOrders(data.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start ordering delicious food!</p>
          <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 flex items-center justify-between hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <FiPackage className="text-xl text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.restaurant?.name || 'Restaurant'} • ₹{order.total}
                  </p>
                  <p className="text-sm text-gray-500">{order.items?.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || ''}`}>
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                    <span className="flex items-center text-xs text-gray-400"><FiClock className="mr-1" /> {order.estimatedDeliveryTime}</span>
                  </div>
                </div>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
