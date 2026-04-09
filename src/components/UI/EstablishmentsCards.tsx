import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import "@/components/UI/RestaurantCards.css";
import RestaurantCards from "./RestaurantCards";
import { getErrorMessage } from "@/services/getErrorMessage";

type Props = {
  variant?: "scroll" | "grid";
};

type Restaurant = {
  id: number;
  title: string;
  description: string;
  logoUrl: string;
  category: string;
  minOrderAmount: number;
  deliveryTime: string;
  imageUrl: string;
};

const API_URL = import.meta.env.VITE_API_URL;
export default function EstablishmentsCards({ variant = "scroll" }: Props) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get(`${API_URL}/public/restaurants`);
        setRestaurants(res.data.content || []);
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("Ошибка загрузки ресторанов:", message);
      }
    };

    fetchRestaurants();
  }, []);

  return (
   
<RestaurantCards title="Establishments" showMore/>
);
}
