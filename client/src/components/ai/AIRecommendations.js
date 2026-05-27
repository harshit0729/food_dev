import React, { useState } from 'react';
import { FiSmile, FiCloud, FiDollarSign, FiHeart, FiTrendingUp, FiSearch } from 'react-icons/fi';
import { aiAPI } from '../../services/api';
import toast from 'react-hot-toast';

const modes = [
  { id: 'mood', icon: FiSmile, label: 'By Mood', color: 'from-pink-400 to-rose-500' },
  { id: 'weather', icon: FiCloud, label: 'By Weather', color: 'from-blue-400 to-cyan-500' },
  { id: 'budget', icon: FiDollarSign, label: 'By Budget', color: 'from-green-400 to-emerald-500' },
  { id: 'healthy', icon: FiHeart, label: 'Healthy', color: 'from-green-500 to-teal-500' },
  { id: 'trending', icon: FiTrendingUp, label: 'Trending', color: 'from-purple-400 to-violet-500' },
];

const AIRecommendations = () => {
  const [activeMode, setActiveMode] = useState('mood');
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!query.trim() && activeMode !== 'trending') {
      toast.error('Please enter your preference');
      return;
    }

    setLoading(true);
    try {
      let data;
      switch (activeMode) {
        case 'mood':
          ({ data } = await aiAPI.recommendByMood({ mood: query })); break;
        case 'weather':
          ({ data } = await aiAPI.recommendByWeather({ weather: query })); break;
        case 'budget':
          ({ data } = await aiAPI.recommendByBudget({ budget: query })); break;
        case 'healthy':
          ({ data } = await aiAPI.recommendHealthy({ query })); break;
        case 'trending':
          ({ data } = await aiAPI.recommendTrending()); break;
        default:
          ({ data } = await aiAPI.smartSearch({ query }));
      }
      setRecommendations(data.data || []);
      if (!data.data?.length) toast.error('No recommendations found');
    } catch {
      toast.error('Failed to get recommendations. Using offline suggestions.');
      setRecommendations(['Biryani', 'Pizza', 'Burger', 'Noodles', 'Ice Cream']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="section-title mb-2">AI Food Recommendations</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Tell us your preference and let AI suggest the perfect meal!</p>

      <div className="flex flex-wrap gap-3 mb-6">
        {modes.map(({ id, icon: Icon, label, color }) => (
          <button
            key={id}
            onClick={() => { setActiveMode(id); setQuery(''); setRecommendations([]); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeMode === id
                ? `bg-gradient-to-r ${color} text-white shadow-md`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Icon className="text-lg" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeMode !== 'trending' && (
        <div className="flex space-x-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeMode === 'mood' ? "e.g., I'm feeling happy, sad, stressed..." :
              activeMode === 'weather' ? "e.g., hot summer day, rainy night..." :
              activeMode === 'budget' ? "e.g., cheap food under ₹200, premium dining..." :
              "e.g., high protein, low carb, vegan..."
            }
            className="input-field flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
          />
          <button onClick={handleRecommend} disabled={loading} className="btn-primary flex items-center space-x-2">
            <FiSearch />
            <span>{loading ? 'Thinking...' : 'Suggest'}</span>
          </button>
        </div>
      )}

      {activeMode === 'trending' && (
        <button onClick={handleRecommend} disabled={loading} className="btn-primary mb-6 flex items-center space-x-2">
          <FiTrendingUp />
          <span>{loading ? 'Loading...' : 'Get Trending Foods'}</span>
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="loading-spinner" />
        </div>
      )}

      {recommendations.length > 0 && !loading && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">AI Suggestions</h3>
          <div className="grid gap-3">
            {recommendations.map((item, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">{typeof item === 'string' ? item : item.name}</span>
                {item.reason && <span className="text-xs text-gray-400 ml-auto">{item.reason}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
