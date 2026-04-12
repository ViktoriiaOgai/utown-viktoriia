import { api } from "./api";

export const searchRestaurants = async (query: string, filters?: { category?: string }) => {
  const params: Record<string, string | number> = {
    title: query,
    page: 0,
    size: 50,
  };

  if (filters?.category) {
    params.category = filters.category;
  }

  const res = await api.get(`/public/restaurants/search`, { params });

  return res.data.content || [];
};
