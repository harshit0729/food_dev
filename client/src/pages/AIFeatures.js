import React from 'react';
import AIRecommendations from '../components/ai/AIRecommendations';
import { FiMessageSquare, FiCalendar, FiSearch, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AIFeatures = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          AI-Powered Features
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Experience the future of food delivery with our intelligent AI features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link to="/ai/chat" className="card p-6 text-center hover:border-primary-200 dark:hover:border-primary-800 group">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <FiMessageSquare className="text-3xl text-white" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500">AI Chatbot</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Chat with AI about food, restaurants, and get recommendations</p>
        </Link>

        <Link to="/ai/recommendations" className="card p-6 text-center hover:border-primary-200 dark:hover:border-primary-800 group">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
            <FiStar className="text-3xl text-white" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500">Smart Recommendations</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get personalized food picks by mood, weather, budget, and more</p>
        </Link>

        <Link to="/ai/meal-planner" className="card p-6 text-center hover:border-primary-200 dark:hover:border-primary-800 group">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <FiCalendar className="text-3xl text-white" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500">AI Meal Planner</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Generate meal plans for gym, weight loss, bulk, and more</p>
        </Link>
      </div>

      <div className="mb-8">
        <AIRecommendations />
      </div>
    </div>
  );
};

export default AIFeatures;
