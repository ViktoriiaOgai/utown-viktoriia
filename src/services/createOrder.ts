import { api } from "./api";

export const createOrder = async (payload: {
  fullAddress: string;
  area: string;
  city: string;
  street: string;
  details: string;
  clientPhone: string;
  deliveryTime: string;

  cookingTime: number;
  orderPrice: number;
  deliveryPrice: number;
  totalSum: number;

  payment: string;
  noteForCourier: string;

  restaurantId: number;

  latitude: number;
  longitude: number;

  postcode: string;
  state: string;
  typeAddress: number;
  intercomCode: string;
}) => {
  const res = await api.post("/orders", payload);
  return res.data;
};
