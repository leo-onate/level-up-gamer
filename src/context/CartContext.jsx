import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchProductById } from "../services/productService";

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

  async function addToCart(product, qty = 1) {
    try {
      // Verificar stock actual del backend
      const currentProduct = await fetchProductById(product.id);
      
      // Calcular cantidad total que ya está en el carrito
      const existingItem = items.find(i => i.id === product.id);
      const totalQtyInCart = existingItem ? existingItem.qty : 0;
      const newTotalQty = totalQtyInCart + qty;

      if (!currentProduct.stock || currentProduct.stock < newTotalQty) {
        alert(`Stock insuficiente. Disponible: ${currentProduct.stock || 0}, en carrito: ${totalQtyInCart}, intentas agregar: ${qty}`);
        return;
      }

      setItems(prev => {
        const found = prev.find(i => i.id === product.id);
        if (found) {
          return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
        } 
        return [...prev, { ...product, qty }];
      });
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      alert('Error al verificar el stock del producto');
    }
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.id !== productId));
  }

  async function updateQty(productId, qty) {
    try {
      // Verificar stock actual del backend
      const currentProduct = await fetchProductById(productId);
      
      if (!currentProduct.stock || currentProduct.stock < qty) {
        alert(`Stock insuficiente. Disponible: ${currentProduct.stock || 0}`);
        return;
      }

      setItems(prev => prev.map(i => i.id === productId ? { ...i, qty: Math.max(1, qty) } : i));
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
      alert('Error al verificar el stock del producto');
    }
  }

  function clearCart() {
    setItems([]);
  }

  function clearCartOnSuccess() {
    setItems([]);
  }

  function getTotal() {
    return items.reduce((s, it) => s + (Number(it.precio) || 0) * (it.qty || 0), 0);
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, getTotal, clearCartOnSuccess }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}