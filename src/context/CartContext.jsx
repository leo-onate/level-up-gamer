import React, { createContext, useContext, useEffect, useState } from "react";
import { products as initialProducts } from "../data/products.js";

const CART_KEY = "cart";
const CartContext = createContext();

export function CartProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
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
    const productInStock = products.find(p => p.id === product.id);
    if (!productInStock || productInStock.stock < qty) {
      alert("No hay suficiente stock para añadir este producto.");
      return;
    }

    setItems(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) {
        if (productInStock.stock < found.qty + qty) {
          alert("No hay suficiente stock para añadir este producto.");
          return prev;
        }
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      } 
      return [...prev, { ...product, qty }];
    });

    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === product.id ? { ...p, stock: p.stock - qty } : p
      )
    );
  }

  function removeFromCart(productId) {
    const itemToRemove = items.find(i => i.id === productId);
    if (!itemToRemove) return;

    setItems(prev => prev.filter(i => i.id !== productId));

    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, stock: p.stock + itemToRemove.qty } : p
      )
    );
  }

  function updateQty(productId, qty) {
    const itemToUpdate = items.find(i => i.id === productId);
    if (!itemToUpdate) return;

    const productInStock = products.find(p => p.id === productId);
    const stockDifference = qty - itemToUpdate.qty;

    if (productInStock.stock < stockDifference) {
      alert("No hay suficiente stock para actualizar la cantidad.");
      return;
    }

    setItems(prev => prev.map(i => i.id === productId ? { ...i, qty: Math.max(1, qty) } : i));

    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, stock: p.stock - stockDifference } : p
      )
    );
  }

  function restoreStock(itemsToRestore) {
    itemsToRestore.forEach(item => {
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === item.id ? { ...p, stock: p.stock + item.qty } : p
        )
      );
    });
  }

  function clearCart() {
    restoreStock(items);
    setItems([]);
  }

  function clearCartOnSuccess() {
    setItems([]);
  }

  function getTotal() {
    return items.reduce((s, it) => s + (Number(it.precio) || 0) * (it.qty || 0), 0);
  }

  return (
    <CartContext.Provider value={{ items, products, addToCart, removeFromCart, updateQty, clearCart, getTotal, clearCartOnSuccess, restoreStock }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}