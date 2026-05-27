import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ search, limit: 50 });
      setUsers(data.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deactivated');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">Manage Users</h1>

      <div className="relative max-w-md mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search users..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
      </div>

      {loading ? <Loader /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${user.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(user._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && <p className="text-center py-8 text-gray-500">No users found</p>}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
