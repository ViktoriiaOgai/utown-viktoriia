export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type DeliveryStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type Order = {
  id: number;
  number: string;

  status: OrderStatus;
  deliveryStatus: DeliveryStatus;

  fullAddress: string;
  area: string;
  city: string;
  street: string;
  details: string;

  clientPhone: string;
  restaurantPhone: string | null;

  deliveryTime: string;
  cookingTime: number;

  orderPrice: number;
  deliveryPrice: number;
  totalSum: number;

  payment: "CARD" | "CASH";
  isPaid: boolean;

  noteForCourier: string;

  userId: number;
  userName: string;

  restaurantId: number;
  restaurantName: string;

  date: string | null;
  time: string | null;

  items?: {
    id: number;
    dishId: number;
    dishTitle: string;
    dishImageUrl?: string | null;
    count: number;
    sum: number;
    orderPrice: number;
    restaurantId: number;
    restaurantName: string;
    elements: string[];
  }[];
};
