import { api } from "./api";

export const searchRestaurants = async (
  query: string,
  filters?: {
    category?: string;
  }
) => {
  const params: any = {
    title: query,
    page: 0,
    size: 10,
  };

  // добавляем ТОЛЬКО если есть
  if (filters?.category && filters.category !== "all") {
    params.category = filters.category;
  }

  const res = await api.get(`/public/restaurants/search`, {
    params,
  });

  return res.data.content || [];
};
