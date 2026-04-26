import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "@/types/cart";
import { CartContext } from "@/context/CartContext";
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
};
