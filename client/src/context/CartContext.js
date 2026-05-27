import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    try {
      const { data } = await cartAPI.getCart();
      setCart(data.data);
    } catch { setCart(null); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (foodItemId, quantity = 1, specialInstructions = '') => {
    setLoading(true);
    try {
      const { data } = await cartAPI.addToCart({ foodItemId, quantity, specialInstructions });
      setCart(data.data);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.updateItem(itemId, { quantity });
      setCart(data.data);
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await cartAPI.removeItem(itemId);
      setCart(data.data);
      toast.success('Removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [], subtotal: 0, deliveryFee: 0, tax: 0, total: 0 });
    } catch {}
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, loading, itemCount, addToCart, updateQuantity, removeItem, clearCart, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
