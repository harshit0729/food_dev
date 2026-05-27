import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import { FiUsers, FiFolder, FiClipboard, FiDollarSign, FiTrendingUp, FiPackage } from 'react-icons/fi';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: res } = await adminAPI.getDashboard();
        setData(res.data);
      } catch {} finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const { stats, recentOrders, ordersByStatus, topRestaurants, topItems } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Admin Dashboard</h1>
        <Link to="/admin/orders" className="btn-primary text-sm">Manage Orders</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'from-blue-400 to-blue-600' },
          { label: 'Restaurants', value: stats?.totalRestaurants || 0, icon: FiFolder, color: 'from-purple-400 to-purple-600' },
          { label: 'Menu Items', value: stats?.totalMenuItems || 0, icon: FiPackage, color: 'from-pink-400 to-pink-600' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FiClipboard, color: 'from-orange-400 to-orange-600' },
          { label: 'Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: FiDollarSign, color: 'from-green-400 to-green-600' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders?.length > 0 ? recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.user?.name}</p>
                  <p className="text-xs text-gray-500">{order.restaurant?.name} • ₹{order.total}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{order.status}</span>
              </div>
            )) : <p className="text-gray-500 text-sm">No recent orders</p>}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {ordersByStatus?.map(({ _id, count }) => (
              <div key={_id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{_id?.replace(/_/g, ' ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(100, (count / (stats?.totalOrders || 1)) * 100)}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                </div>
              </div>
            ))}
            {(!ordersByStatus || ordersByStatus.length === 0) && <p className="text-gray-500 text-sm">No orders</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><FiTrendingUp className="mr-2 text-primary-500" /> Top Restaurants</h2>
          <div className="space-y-3">
            {topRestaurants?.map((r, i) => (
              <div key={r._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</span>
                </div>
                <span className="text-sm text-gray-500">{r.orderCount} orders • {r.rating}★</span>
              </div>
            )) || <p className="text-gray-500 text-sm">No data</p>}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><FiPackage className="mr-2 text-secondary-500" /> Top Food Items</h2>
          <div className="space-y-3">
            {topItems?.map((item, i) => (
              <div key={item._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                </div>
                <span className="text-sm text-gray-500">{item.orderCount} orders • ₹{item.price}</span>
              </div>
            )) || <p className="text-gray-500 text-sm">No data</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
