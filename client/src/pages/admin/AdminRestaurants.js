import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', cuisine: '', priceRange: '$$', deliveryFee: 0, deliveryTime: '20-30 min' });

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const { data } = await restaurantAPI.getAll({ limit: 50 });
      setRestaurants(data.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchRestaurants(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await restaurantAPI.create({
        ...form,
        cuisine: form.cuisine.split(',').map((c) => c.trim()),
        deliveryFee: Number(form.deliveryFee),
      });
      toast.success('Restaurant created');
      setShowForm(false);
      setForm({ name: '', description: '', cuisine: '', priceRange: '$$', deliveryFee: 0, deliveryTime: '20-30 min' });
      fetchRestaurants();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Manage Restaurants</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-1">
          <FiPlus /> <span>Add Restaurant</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">New Restaurant</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div><input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
            <div><input type="text" placeholder="Cuisine (comma separated)" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} className="input-field" required /></div>
            <div><textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} /></div>
            <div className="grid grid-cols-3 gap-2">
              <select value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} className="input-field"><option value="$">$</option><option value="$$">$$</option><option value="$$$">$$$</option><option value="$$$$">$$$$</option></select>
              <input type="number" placeholder="Delivery Fee" value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })} className="input-field" />
              <input type="text" placeholder="Delivery Time" value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} className="input-field" />
            </div>
          </div>
          <button type="submit" className="btn-primary">Create Restaurant</button>
        </form>
      )}

      {loading ? <Loader /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Cuisine</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Rating</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Orders</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {restaurants.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{r.name}</td>
                    <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{r.cuisine?.slice(0, 2).map((c, i) => <span key={i} className="badge-primary text-xs">{c}</span>)}</div></td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.rating?.toFixed(1)}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.orderCount}</td>
                    <td className="px-4 py-3"><span className={`badge text-xs ${r.isOpen ? 'badge-success' : 'badge-danger'}`}>{r.isOpen ? 'Open' : 'Closed'}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-primary-500"><FiEdit2 /></button>
                        <button className="p-2 text-gray-400 hover:text-red-500"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {restaurants.length === 0 && <p className="text-center py-8 text-gray-500">No restaurants</p>}
        </div>
      )}
    </div>
  );
};

export default AdminRestaurants;
