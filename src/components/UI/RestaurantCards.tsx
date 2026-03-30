// components/UI/RestaurantCards.tsx
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import "@/components/UI/RestaurantCards.css";
import placeholder from "@/assets/images/Ad 1.svg";
import Deliver from "@/assets/icons/deliver.svg?react";
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
export default function RestaurantCards({ variant = "scroll" }: Props) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

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
    <div className="restaurants-section">
      <div className="restaurants-header">
        <h2>Food Delivery</h2>
      </div>

      <div className={`restaurant-cards-container ${variant === "grid" ? "vertical" : ""}`}>
        {restaurants.map((r) => (
          <div className="restaurant-card" key={r.id}>
            <img
              className="title"
              src={r.imageUrl || placeholder}
              alt={r.title}
              onError={(e) => {
                e.currentTarget.src = placeholder;
              }}
            />
            <h4 className="title">{r.title}</h4>
            <p className="categ">{r.category}</p>
            <p className="categ">
              <Deliver /> {r.minOrderAmount}₩ • {r.deliveryTime}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
