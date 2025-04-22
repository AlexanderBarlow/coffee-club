"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // ✅ NEW

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
    setIsLoaded(true); // ✅ Signal that the cart has been initialized
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const updated = [...prevCart, item];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
