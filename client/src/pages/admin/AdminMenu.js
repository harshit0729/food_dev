import React, { useState, useEffect } from 'react';
import { foodAPI, restaurantAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', restaurant: '', category: 'Main Course',
    cuisine: '', isVegetarian: false, spiceLevel: 'medium',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [foodRes, restRes] = await Promise.all([
        foodAPI.getAll({ limit: 50 }),
        restaurantAPI.getAll({ limit: 50 }),
      ]);
      setItems(foodRes.data.data || []);
      setRestaurants(restRes.data.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await foodAPI.create({ ...form, price: Number(form.price) });
      toast.success('Menu item created');
      setShowForm(false);
      setForm({ name: '', description: '', price: '', restaurant: '', category: 'Main Course', cuisine: '', isVegetarian: false, spiceLevel: 'medium' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Manage Menu Items</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-1">
          <FiPlus /> <span>Add Item</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">New Menu Item</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" required />
            <select value={form.restaurant} onChange={(e) => setForm({ ...form, restaurant: e.target.value })} className="input-field" required>
              <option value="">Select Restaurant</option>
              {restaurants.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
            <input type="text" placeholder="Cuisine" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} className="input-field" required />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              {['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Salad', 'Soup', 'Breakfast'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.spiceLevel} onChange={(e) => setForm({ ...form, spiceLevel: e.target.value })} className="input-field">
              <option value="mild">Mild</option><option value="medium">Medium</option><option value="hot">Hot</option><option value="extra hot">Extra Hot</option>
            </select>
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field col-span-2" rows={2} />
            <label className="flex items-center space-x-2"><input type="checkbox" checked={form.isVegetarian} onChange={(e) => setForm({ ...form, isVegetarian: e.target.checked })} className="accent-primary-500" /><span className="text-sm text-gray-700 dark:text-gray-300">Vegetarian</span></label>
          </div>
          <button type="submit" className="btn-primary">Create Item</button>
        </form>
      )}

      {loading ? <Loader /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Restaurant</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Rating</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Available</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.restaurant?.name || 'N/A'}</td>
                    <td className="px-4 py-3"><span className="badge-primary text-xs">{item.category}</span></td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">₹{item.price}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.rating?.toFixed(1)}</td>
                    <td className="px-4 py-3"><span className={`badge text-xs ${item.isAvailable ? 'badge-success' : 'badge-danger'}`}>{item.isAvailable ? 'Yes' : 'No'}</span></td>
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
          {items.length === 0 && <p className="text-center py-8 text-gray-500">No menu items</p>}
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
