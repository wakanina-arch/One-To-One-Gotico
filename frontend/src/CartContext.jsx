/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Carga inicial
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('uni_cart');
      console.log('CartProvider - carga inicial:', saved); // LOG
      return saved ? JSON.parse(saved) : [];
    } catch { 
      return []; 
    }
  });
  
  const [orders, setOrders] = useState([]);

  // 2. Persistencia automática
  useEffect(() => {
    console.log('CartProvider - guardando en localStorage:', cartItems); // LOG
    localStorage.setItem('uni_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- FUNCIONES ---
  
  const addToCart = useCallback((item) => {
    console.log('🟢 addToCart - item recibido:', item); // LOG
    setCartItems(prev => {
      console.log('🟢 addToCart - prev:', prev); // LOG
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, cantidad: (i.cantidad || 1) + 1 } 
            : i
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    console.log('🔴 removeFromCart - id:', id); // LOG
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    console.log('🟡 updateQuantity - id:', id, 'delta:', delta); // LOG
    setCartItems(prev => 
      prev.map(i => {
        if (i.id === id) {
          const nuevaCantidad = (i.cantidad || 1) + delta;
          return { ...i, cantidad: Math.max(1, nuevaCantidad) };
        }
        return i;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    console.log('⚪ clearCart'); // LOG
    setCartItems([]);
    localStorage.removeItem('uni_cart');
  }, []);

  const calculateTotal = useCallback(() => {
    const total = cartItems.reduce((sum, item) => 
      sum + (item.precio * (item.cantidad || 1)), 0
    );
    console.log('🧮 calculateTotal:', total); // LOG
    return parseFloat(total.toFixed(2));
  }, [cartItems]);

  const addOrder = useCallback((order) => {
    const newOrder = { ...order, id: `QR-${Date.now()}` };
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  }, []);

  const itemCount = React.useMemo(() => {
    return cartItems.reduce((acc, i) => acc + (i.cantidad || 1), 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    itemCount,
    orders,
    addOrder
  };

  console.log('📦 CartProvider - value.cartItems:', cartItems); // LOG

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.error('❌ useCart: no hay contexto!'); // LOG
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};
