import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCpu, FiUser, FiX, FiMessageSquare } from 'react-icons/fi';
import { aiAPI } from '../../services/api';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m FoodFlow AI assistant. Ask me about food recommendations, restaurants, or anything food-related!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const { data } = await aiAPI.chat({ message: userMsg.content, conversationHistory: history });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.data || 'Here are some suggestions based on your request!' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg transition-all z-40 hover:scale-110"
      >
        <FiMessageSquare className="text-2xl" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiCpu className="text-white text-xl" />
              <span className="text-white font-semibold">FoodFlow AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary-500 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {msg.role === 'assistant' ? <FiCpu className="text-sm" /> : <FiUser className="text-sm" />}
                    <span className="text-xs font-medium">{msg.role === 'assistant' ? 'AI' : 'You'}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about food..."
                className="input-field flex-1 py-2 text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="btn-primary px-4 py-2"
              >
                <FiSend />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
