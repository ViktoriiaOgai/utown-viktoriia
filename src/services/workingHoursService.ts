import { api } from "./api";

export type OperatingMode = {
  id: number;
  dayOfWeek: number;
  start: string;
  end: string;
  dayOff: boolean;
};

export const getMyRestaurant = async () => {
  const res = await api.get("/restaurant-owner/restaurants");
  const restaurants = res.data;
  if (!restaurants || restaurants.length === 0) throw new Error("No restaurant found");
  return restaurants[0];
};

export const getOperatingModes = async (restaurantId: number): Promise<OperatingMode[]> => {
  const res = await api.get(`/restaurant-owner/restaurants/${restaurantId}/operating-modes`);
  return res.data;
};

export const createOperatingMode = async (
  restaurantId: number,
  data: { dayOfWeek: number; start: string; end: string; dayOff: boolean }
): Promise<OperatingMode> => {
  const res = await api.post(`/restaurant-owner/restaurants/${restaurantId}/operating-modes`, data);
  return res.data;
};

export const updateOperatingMode = async (
  restaurantId: number,
  modeId: number,
  data: { dayOfWeek: number; start: string; end: string; dayOff: boolean }
): Promise<OperatingMode> => {
  const res = await api.put(
    `/restaurant-owner/restaurants/${restaurantId}/operating-modes/${modeId}`,
    data
  );
  return res.data;
};
