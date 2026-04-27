import { createContext } from "react";
import type { CartItem } from "@/types/cart";

type CartContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

export const CartContext = createContext<CartContextType | null>(null);
