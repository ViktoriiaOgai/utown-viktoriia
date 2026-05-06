export type Restaurant = {
  id: number;
  title: string;
  description: string;
  logoUrl?: string;
  imageUrl?: string;
  category: string;
  minOrderAmount: number;
  deliveryTime: string;
  isActive?: boolean;
  isFavorite?: boolean;
};
export type Orders = {
  id: number;
  restaurantName: string;
  deliveryTime?: string;
  time?: string;
  orderPrice: number;
  deliveryPrice: number;
  totalSum: number;
  fullAddress?: string;
  noteForCourier?: string;
  addresses?: {
    id: number;
    fullAddress: string;
  }[];
  status?: string;
};

export type Address = {
  id: number;
  fullAddress: string;
};
