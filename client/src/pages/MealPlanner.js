import React, { useState } from 'react';
import { aiAPI } from '../services/api';
import { FiTarget, FiDroplet, FiZap, FiFeather, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const goals = [
  { id: 'gym', icon: FiZap, label: 'Gym / Fitness', color: 'from-blue-400 to-blue-600' },
  { id: 'weight_loss', icon: FiDroplet, label: 'Weight Loss', color: 'from-green-400 to-emerald-500' },
  { id: 'bulk', icon: FiTarget, label: 'Bulking', color: 'from-orange-400 to-red-500' },
  { id: 'vegetarian', icon: FiFeather, label: 'Vegetarian', color: 'from-teal-400 to-green-500' },
];

const MealPlanner = () => {
  const [selectedGoal, setSelectedGoal] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async (goal) => {
    setSelectedGoal(goal);
    setLoading(true);
    try {
      const { data } = await aiAPI.getMealPlan({ goal });
      setMealPlan(data.data || '');
    } catch {
      toast.error('Failed to generate meal plan. Using offline suggestions.');
      setMealPlan(getFallbackPlan(goal));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPlan = (goal) => {
    const plans = {
      gym: `**Meal Plan for Gym/Fitness**
Breakfast: Oatmeal with protein powder and banana
Snack 1: Greek yogurt with almonds
Lunch: Grilled chicken breast with brown rice and broccoli
Snack 2: Protein shake with peanut butter
Dinner: Salmon with sweet potato and asparagus`,
      weight_loss: `**Meal Plan for Weight Loss**
Breakfast: Smoothie bowl with berries and chia seeds
Snack 1: Apple slices with almond butter
Lunch: Quinoa salad with grilled vegetables and tofu
Snack 2: Celery sticks with hummus
Dinner: Grilled fish with steamed vegetables`,
      bulk: `**Meal Plan for Bulking**
Breakfast: 4-egg omelette with whole wheat toast and avocado
Snack 1: Cottage cheese with fruit
Lunch: Beef steak with sweet potato and mixed vegetables
Snack 2: Trail mix and protein bar
Dinner: Chicken thigh with rice and beans`,
      vegetarian: `**Vegetarian Meal Plan**
Breakfast: Vegetable poha with peanuts and lemon
Snack 1: Mixed fruit bowl
Lunch: Dal rice with roti and salad
Snack 2: Roasted chana and sprouts
Dinner: Paneer butter masala with naan`,
    };
    return plans[goal] || plans.gym;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          AI Meal Planner
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Select your goal and let AI create a personalized meal plan</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {goals.map(({ id, icon: Icon, label, color }) => (
          <button
            key={id}
            onClick={() => handleGeneratePlan(id)}
            disabled={loading}
            className={`card p-6 text-center hover:border-primary-200 transition-all ${
              selectedGoal === id ? 'ring-2 ring-primary-500 border-primary-500' : ''
            }`}
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="text-xl text-white" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{label}</p>
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-500">AI is creating your personalized meal plan...</p>
        </div>
      )}

      {mealPlan && !loading && (
        <div className="card p-8">
          <div className="flex items-center space-x-2 mb-6">
            <FiCalendar className="text-2xl text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Meal Plan</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {mealPlan.split('\n').map((line, i) => {
              if (line.startsWith('**')) {
                return <h3 key={i} className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
              }
              if (line.match(/^[A-Za-z]/)) {
                const [meal, ...food] = line.split(': ');
                return (
                  <div key={i} className="flex items-start space-x-3 mb-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{meal}:</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">{food.join(': ')}</span>
                    </div>
                  </div>
                );
              }
              if (line.trim()) {
                return <p key={i} className="text-gray-600 dark:text-gray-400">{line}</p>;
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
