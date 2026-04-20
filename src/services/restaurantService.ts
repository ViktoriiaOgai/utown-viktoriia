import { api } from "./api";

type SearchParams = {
  page: number;
  size: number;
} & Partial<{
  title: string;
  category: string;
  minRating: number;
  city: string;
}>;

export const searchRestaurants = async (params: { title?: string; category?: string }) => {
  const queryParams: SearchParams = {
    page: 0,
    size: 50,
  };

  if (params.title?.trim()) {
    queryParams.title = params.title;
  }

  if (params.category?.trim()) {
    queryParams.category = params.category;
  }

  const res = await api.get(`/public/restaurants/search/advanced`, {
    params: queryParams,
  });

  return res.data.content || [];
};
export const getRestaurantAverageRating = async (restaurantId: number): Promise<number | null> => {
  try {
    const res = await api.get(`/ratings/restaurant/${restaurantId}/average`);
    const data = res.data;

    console.log("AVG RATING RAW:", data);

    if (typeof data === "number") return data;

    if (typeof data === "object" && data !== null) {
      const possible = data.average ?? data.value ?? data.rating ?? Object.values(data)[0];

      return Number(possible) || null;
    }

    return null;
  } catch (error) {
    console.error("Ошибка получения рейтинга:", error);
    return null;
  }
};

export const isRestaurantFavorite = async (restaurantId: number): Promise<boolean> => {
  try {
    const res = await api.get(`/favorites/restaurants/${restaurantId}/is-favorite`);
    const data = res.data;

    // нормализация (swagger кривой)
    if (typeof data === "boolean") return data;
    if (typeof data === "object" && data !== null) {
      return Object.values(data)[0] as boolean;
    }

    return false;
  } catch {
    return false;
  }
};

export const addToFavorites = async (restaurantId: number) => {
  return api.post(`/favorites/restaurants/${restaurantId}`);
};

export const removeFromFavorites = async (restaurantId: number) => {
  return api.delete(`/favorites/restaurants/${restaurantId}`);
};

export const getCategoriesByRestaurant = async (restaurantId: number) => {
  const res = await api.get(`/categories/restaurant/${restaurantId}`);
  return res.data;
};
export const getDishesByRestaurantAndCategory = async (
  restaurantId: number,
  categoryId: number
) => {
  const res = await api.get(`/dishes/restaurant/${restaurantId}/category/${categoryId}`);
  return res.data;
};
export const getDishesByRestaurant = async (restaurantId: number) => {
  const res = await api.get(`/dishes/restaurant/${restaurantId}`);
  return res.data;
};
