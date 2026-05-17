import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Restaurant } from "@/types/restaurant";
import type { ApiResponse } from "@/types/api";

export function useRestaurantsData(): Restaurant[] {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get<ApiResponse<Restaurant>>("/public/restaurants", {
        params: { page: 0, size: 100 },
      });

      setRestaurants(res.data.content ?? []);
    };

    fetchData();
  }, []);

  return restaurants;
}
