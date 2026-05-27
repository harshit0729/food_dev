import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { FiSun, FiMoon, FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              FoodFlow AI
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search food or restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-2 text-sm"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/restaurants" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors text-sm font-medium">
              Restaurants
            </Link>

            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {darkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
            </button>

            <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <FiShoppingCart className="text-xl text-gray-600 dark:text-gray-300" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium text-secondary-500 hover:text-secondary-600">
                    Admin
                  </Link>
                )}
                <Link to="/orders" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 text-sm font-medium">
                  Orders
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <FiUser className="text-gray-600 dark:text-gray-300" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      Profile
                    </Link>
                    <Link to="/profile/addresses" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      Addresses
                    </Link>
                    <hr className="border-gray-100 dark:border-gray-700" />
                    <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2">
                      <FiLogOut /> <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-3 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 py-2 text-sm" />
              </div>
            </form>
            <Link to="/restaurants" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 dark:text-gray-300">Restaurants</Link>
            <Link to="/cart" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 dark:text-gray-300">Cart ({itemCount})</Link>
            {isAuthenticated ? (
              <>
                <Link to="/orders" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 dark:text-gray-300">Orders</Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 text-gray-600 dark:text-gray-300">Profile</Link>
                {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2 text-secondary-500">Admin Dashboard</Link>}
                <button onClick={() => { logout(); setIsOpen(false); }} className="block py-2 text-red-600">Logout</button>
              </>
            ) : (
              <div className="flex space-x-2 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary text-sm flex-1 text-center">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-sm flex-1 text-center">Sign Up</Link>
              </div>
            )}
            <button onClick={toggleDarkMode} className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300">
              {darkMode ? <FiSun /> : <FiMoon />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
