import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    await api.post('/cart/items', { productId, quantity });
    await fetchCart();
  };

  const updateItem = async (itemId, quantity) => {
    await api.put(`/cart/items/${itemId}`, { quantity });
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/items/${itemId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart');
    await fetchCart();
  };

  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const total = cart.items?.reduce((sum, item) => sum + item.quantity * parseFloat(item.Product?.price || 0), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, clearCart, fetchCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
