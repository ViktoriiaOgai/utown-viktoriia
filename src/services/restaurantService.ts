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
