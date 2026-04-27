// services/cartService.ts
import { api } from "./api";

export const getMyCart = async () => {
  const res = await api.get("/my-cart");
  return res.data;
};

export const addToCart = async (dishId: number, count: number) => {
  const res = await api.post("/my-cart/items", {
    dishId,
    count,
    elementIds: [],
  });
  return res.data;
};

export const removeFromCart = async (dishId: number) => {
  const res = await api.delete(`/my-cart/items/${dishId}`);
  return res.data;
};

export const updateCartItem = async (dishId: number, quantity: number) => {
  const res = await api.put(`/my-cart/items/${dishId}?quantity=${quantity}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.post("/my-cart/clear");
  return res.data;
};
