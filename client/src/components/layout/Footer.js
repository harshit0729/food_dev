import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-4">
              FoodFlow AI
            </h3>
            <p className="text-sm text-gray-400">
              Smart food delivery platform powered by AI. Get personalized recommendations, smart search, and more.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/restaurants" className="block hover:text-primary-400 transition-colors">Restaurants</Link>
              <Link to="/cart" className="block hover:text-primary-400 transition-colors">Cart</Link>
              <Link to="/orders" className="block hover:text-primary-400 transition-colors">Orders</Link>
              <Link to="/ai" className="block hover:text-primary-400 transition-colors">AI Recommendations</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">AI Features</h4>
            <div className="space-y-2 text-sm">
              <Link to="/ai/chat" className="block hover:text-primary-400 transition-colors">AI Chatbot</Link>
              <Link to="/ai/meal-planner" className="block hover:text-primary-400 transition-colors">Meal Planner</Link>
              <Link to="/ai/recommendations" className="block hover:text-primary-400 transition-colors">Recommendations</Link>
              <Link to="/ai/search" className="block hover:text-primary-400 transition-colors">Smart Search</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <div className="space-y-2 text-sm">
              <p>help@foodflow.ai</p>
              <p>1-800-FOODFLOW</p>
              <p>Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FoodFlow AI. All rights reserved. Built with MERN & AI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
