import React, { createContext, useContext, useEffect, useState } from "react";

const CART_KEY = "cart";
const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  function addToCart(product, qty = 1) {
    setItems(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...product, qty }];
    });
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.id !== productId));
  }

  function updateQty(productId, qty) {
    setItems(prev => prev.map(i => i.id === productId ? { ...i, qty: Math.max(1, qty) } : i));
  }

  function clearCart() {
    setItems([]);
  }

  function getTotal() {
    return items.reduce((s, it) => s + (Number(it.precio) || 0) * (it.qty || 0), 0);
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}