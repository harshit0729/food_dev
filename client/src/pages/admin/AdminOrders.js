import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filter) params.status = filter;
      const { data } = await orderAPI.getAllOrders(params);
      setOrders(data.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, { status });
      toast.success(`Order ${status}`);
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Manage Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-40">
          <option value="">All Orders</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Order ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Restaurant</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Items</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">#{order._id.slice(-8)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{order.user?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.restaurant?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">₹{order.total}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${
                        order.status === 'delivered' ? 'badge-success' :
                        order.status === 'cancelled' ? 'badge-danger' :
                        order.status === 'pending' ? 'badge-warning' : 'badge-primary'
                      }`}>{order.status?.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        {statusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && <p className="text-center py-8 text-gray-500">No orders found</p>}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
