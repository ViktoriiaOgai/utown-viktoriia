export type Dish = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  restaurantId: number;
  dishCategoryId: number;
  categoryName: string;
  buttonText: string;
};

export type DishOption = {
  id: string;
  label: string;
  price: number;
};

export type CartItem = {
  id: number;
  dish: Dish;
  quantity: number;
  option: DishOption | null;
};
