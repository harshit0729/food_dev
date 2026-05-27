import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    cuisine: user?.preferences?.cuisine?.join(', ') || '',
    spiceLevel: user?.preferences?.spiceLevel || 'medium',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        preferences: {
          cuisine: form.cuisine.split(',').map((c) => c.trim()).filter(Boolean),
          spiceLevel: form.spiceLevel,
        },
      });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password updated');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-8">My Profile</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="badge-primary text-xs mt-1 inline-block">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Cuisines (comma separated)</label>
              <input type="text" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} className="input-field" placeholder="Indian, Chinese, Italian" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spice Level</label>
              <select value={form.spiceLevel} onChange={(e) => setForm({ ...form, spiceLevel: e.target.value })} className="input-field">
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Update Profile'}</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="input-field" minLength={6} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="input-field" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
