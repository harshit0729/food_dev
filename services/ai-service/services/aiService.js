const axios = require('axios');
const AIRecommendation = require('../models/AIRecommendation');

const AI_PROVIDER = process.env.AI_PROVIDER || 'openrouter';

const providers = {
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    key: process.env.OPENROUTER_API_KEY,
    model: 'openai/gpt-3.5-turbo',
  },
  huggingface: {
    url: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
    key: process.env.HUGGINGFACE_API_KEY,
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    key: process.env.GROQ_API_KEY,
    model: 'mixtral-8x7b-32768',
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    key: process.env.GEMINI_API_KEY,
  },
};

const getConfig = () => {
  const config = providers[AI_PROVIDER];
  if (!config || !config.key) {
    throw new Error(`AI provider ${AI_PROVIDER} not configured. Check your API keys.`);
  }
  return config;
};

const buildPrompt = (systemPrompt, userMessage) => {
  const config = getConfig();
  switch (AI_PROVIDER) {
    case 'openrouter':
    case 'groq':
      return { model: config.model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }], temperature: 0.7, max_tokens: 500 };
    case 'huggingface':
      return { inputs: `<s>[INST] ${systemPrompt}\n\n${userMessage} [/INST]`, parameters: { max_new_tokens: 500, temperature: 0.7 } };
    case 'gemini':
      return { contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }] }] };
    default:
      throw new Error(`Unsupported AI provider: ${AI_PROVIDER}`);
  }
};

const makeRequest = async (payload) => {
  const config = getConfig();
  try {
    let response;
    switch (AI_PROVIDER) {
      case 'openrouter':
        response = await axios.post(config.url, payload, {
          headers: { 'Authorization': `Bearer ${config.key}`, 'Content-Type': 'application/json', 'HTTP-Referer': process.env.CLIENT_URL || 'http://56.228.12.101:3000' },
          timeout: 15000,
        });
        return response.data.choices[0].message.content;
      case 'groq':
        response = await axios.post(config.url, payload, {
          headers: { 'Authorization': `Bearer ${config.key}`, 'Content-Type': 'application/json' },
          timeout: 15000,
        });
        return response.data.choices[0].message.content;
      case 'huggingface':
        response = await axios.post(config.url, payload, {
          headers: { 'Authorization': `Bearer ${config.key}` },
          timeout: 20000,
        });
        return response.data[0]?.generated_text || '';
      case 'gemini':
        response = await axios.post(`${config.url}?key=${config.key}`, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
        });
        return response.data.candidates[0]?.content?.parts[0]?.text || '';
      default:
        throw new Error(`Unsupported AI provider: ${AI_PROVIDER}`);
    }
  } catch (error) {
    console.error(`AI API Error (${AI_PROVIDER}):`, error.message);
    return null;
  }
};

const parseAIResponse = (text, format = 'list') => {
  if (!text) return [];
  if (format === 'json') {
    try { const jsonMatch = text.match(/\[[\s\S]*\]/); if (jsonMatch) return JSON.parse(jsonMatch[0]); } catch {}
    return [];
  }
  return text.split('\n').filter((l) => l.trim()).map((line) => line.replace(/^[-*\d.]+/, '').trim()).filter((l) => l.length > 0);
};

exports.getRecommendations = async (query, type = 'mood', userId = null) => {
  const systemPrompts = {
    mood: 'You are a food recommendation expert. Suggest 5 food items based on the user\'s mood. Return only the food names, one per line. Be creative and specific.',
    weather: 'You are a food recommendation expert. Suggest 5 food items suitable for the given weather condition. Return only the food names, one per line.',
    budget: 'You are a food recommendation expert. Suggest 5 budget-friendly food items based on the user\'s budget. Return only the food names, one per line.',
    healthy: 'You are a nutrition expert. Suggest 5 healthy meal options based on the user\'s request. Return only the food names, one per line.',
    trending: 'You are a food trend analyst. Suggest 5 trending food items people are ordering right now. Return only the food names, one per line.',
    meal_plan: 'You are a nutritionist and meal planner. Create a personalized meal plan based on user\'s goal. Return breakfast, lunch, dinner, and snacks suggestions. Format clearly.',
    search: 'You are a smart food search assistant. Interpret the user\'s natural language query and suggest relevant food items they might be looking for. Return food names one per line.',
    chat: 'You are a friendly food assistant chatbot. Help users with food suggestions, restaurant recommendations, order help, and FAQs. Be concise and helpful.',
    summarize: 'You are a review analyst. Summarize the following food/restaurant reviews into: 1. Positive Summary 2. Negative Summary 3. Most Common Feedback. Be concise and specific.',
  };

  const systemPrompt = systemPrompts[type] || systemPrompts.chat;
  const aiText = await makeRequest(buildPrompt(systemPrompt, query));

  if (!aiText) return getFallbackRecommendations(query, type);

  const result = type === 'summarize' ? aiText : parseAIResponse(aiText);

  if (userId && type !== 'chat' && type !== 'summarize') {
    await AIRecommendation.create({ user: userId, queryType: type, query, response: result, recommendations: result.map((name) => ({ name })) });
  }
  return result;
};

const getFallbackRecommendations = (query, type) => {
  const fallbacks = {
    mood: { happy: ['Chocolate Cake', 'Ice Cream Sundae', 'Pizza', 'Sushi', 'Fruit Smoothie'], sad: ['Mac and Cheese', 'Warm Soup', 'Dark Chocolate', 'Mashed Potatoes', 'Hot Tea'], stressed: ['Green Salad', 'Avocado Toast', 'Smoothie Bowl', 'Herbal Tea', 'Dark Chocolate'], tired: ['Coffee', 'Energy Smoothie', 'Protein Bar', 'Banana', 'Oatmeal'], default: ['Biryani', 'Pizza', 'Burger', 'Noodles', 'Ice Cream'] },
    weather: { hot: ['Ice Cream', 'Cold Coffee', 'Watermelon Juice', 'Salad', 'Smoothie'], cold: ['Hot Soup', 'Hot Chocolate', 'Stew', 'Ginger Tea', 'Warm Pasta'], rainy: ['Pakoras', 'Garam Chai', 'Soup', 'Corn on Cob', 'Noodles'], default: ['Lemonade', 'Iced Tea', 'Fresh Juice', 'Fruit Salad', 'Yogurt'] },
    budget: { low: ['Street Food', 'Local Thali', 'Sandwich', 'Noodles', 'Rice Bowl'], medium: ['Biryani', 'Pizza', 'Pasta', 'Burger', 'Curry'], high: ['Steak', 'Sushi', 'Lobster', 'Fine Dining Platter', 'Gourmet Pizza'], default: ['Burger', 'Pizza', 'Sandwich', 'Pasta', 'Salad'] },
    healthy: { default: ['Greek Salad', 'Grilled Chicken', 'Quinoa Bowl', 'Smoothie', 'Fruit Bowl'] },
    trending: { default: ['Sushi Bowl', 'Avocado Toast', 'Bubble Tea', 'Beyond Burger', 'Keto Bowl'] },
  };

  const lower = query.toLowerCase();
  let category = 'default';
  if (type === 'mood') {
    if (lower.includes('happy')) category = 'happy';
    else if (lower.includes('sad')) category = 'sad';
    else if (lower.includes('stress')) category = 'stressed';
    else if (lower.includes('tired')) category = 'tired';
  } else if (type === 'weather') {
    if (lower.includes('hot') || lower.includes('summer')) category = 'hot';
    else if (lower.includes('cold') || lower.includes('winter')) category = 'cold';
    else if (lower.includes('rain')) category = 'rainy';
  } else if (type === 'budget') {
    if (lower.includes('cheap') || lower.includes('low') || lower.includes('under')) category = 'low';
    else if (lower.includes('medium') || lower.includes('moderate')) category = 'medium';
    else if (lower.includes('high') || lower.includes('expensive') || lower.includes('premium')) category = 'high';
  }

  return fallbacks[type]?.[category] || fallbacks[type]?.default || ['Biryani', 'Pizza', 'Burger', 'Noodles', 'Ice Cream'];
};

exports.getMealPlan = async (userGoal, preferences = {}) => {
  const prompt = `Create a detailed daily meal plan for a user with goal: "${userGoal}".${preferences.dietary ? ` Dietary preference: ${preferences.dietary}` : ''}${preferences.calories ? ` Target calories: ${preferences.calories}` : ''} Include breakfast, lunch, dinner, and 2 snacks. Format with clear sections.`;
  const result = await exports.getRecommendations(prompt, 'meal_plan');
  if (Array.isArray(result) && result.length <= 5) return formatMealPlanFallback(userGoal);
  return Array.isArray(result) ? result.join('\n') : result;
};

const formatMealPlanFallback = (goal) => {
  const plans = {
    gym: `**Meal Plan for Gym/Fitness**\nBreakfast: Oatmeal with protein powder and banana\nSnack 1: Greek yogurt with almonds\nLunch: Grilled chicken breast with brown rice and broccoli\nSnack 2: Protein shake with peanut butter\nDinner: Salmon with sweet potato and asparagus`,
    weight_loss: `**Meal Plan for Weight Loss**\nBreakfast: Smoothie bowl with berries and chia seeds\nSnack 1: Apple slices with almond butter\nLunch: Quinoa salad with grilled vegetables and tofu\nSnack 2: Celery sticks with hummus\nDinner: Grilled fish with steamed vegetables`,
    bulk: `**Meal Plan for Bulking**\nBreakfast: 4-egg omelette with whole wheat toast and avocado\nSnack 1: Cottage cheese with fruit\nLunch: Beef steak with sweet potato and mixed vegetables\nSnack 2: Trail mix and protein bar\nDinner: Chicken thigh with rice and beans`,
    vegetarian: `**Vegetarian Meal Plan**\nBreakfast: Vegetable poha with peanuts and lemon\nSnack 1: Mixed fruit bowl\nLunch: Dal rice with roti and salad\nSnack 2: Roasted chana and sprouts\nDinner: Paneer butter masala with naan`,
    default: `**Balanced Meal Plan**\nBreakfast: Whole grain cereal with milk and fruit\nSnack 1: Mixed nuts and seeds\nLunch: Brown rice bowl with vegetables and legumes\nSnack 2: Fruit smoothie\nDinner: Grilled fish/tofu with quinoa and roasted vegetables`,
  };
  const g = goal.toLowerCase();
  if (g.includes('gym') || g.includes('fitness')) return plans.gym;
  if (g.includes('weight loss') || g.includes('lose')) return plans.weight_loss;
  if (g.includes('bulk') || g.includes('mass') || g.includes('gain')) return plans.bulk;
  if (g.includes('vegetarian') || g.includes('vegan')) return plans.vegetarian;
  return plans.default;
};

exports.summarizeReviews = async (reviews, foodItemName) => {
  const reviewText = reviews.map((r) => `"${r.comment}" (${r.rating}/5)`).join('\n');
  const prompt = `Summarize these reviews for "${foodItemName}":\n${reviewText}`;
  return await exports.getRecommendations(prompt, 'summarize');
};

exports.chatWithAI = async (message, conversationHistory = []) => {
  const context = conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join('\n');
  const prompt = `Previous conversation:\n${context}\n\nUser message: ${message}`;
  const result = await exports.getRecommendations(prompt, 'chat');
  return typeof result === 'string' ? result : result.join('\n');
};

exports.smartSearch = async (query) => {
  const result = await exports.getRecommendations(query, 'search');
  return Array.isArray(result) ? result : [query];
};
