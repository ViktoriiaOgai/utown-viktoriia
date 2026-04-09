// components/UI/RestaurantCards.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import "@/components/UI/RestaurantCards.css";
import placeholder from "@/assets/images/Ad 1.svg";
import Deliver from "@/assets/icons/deliver.svg?react";
import { getErrorMessage } from "@/services/getErrorMessage";

type Props = {
  variant?: "scroll" | "grid" | "row";
  title?: string;
  data?: Restaurant[];
  showMore?: boolean;
};

type Restaurant = {
  id: number;
  title: string;
  description: string;
  logoUrl?: string;
  imageUrl?: string;
  category: string;
  minOrderAmount: number;
  deliveryTime: string;
};

const API_URL = import.meta.env.VITE_API_URL;
export default function RestaurantCards({
  variant = "scroll",
  title = "Food Delivery",
  data,
  showMore = false,
}: Props) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    // если пришли данные — НЕ делаем запрос
    if (data) {
      setRestaurants(data);
      return;
    }
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
  }, [data]);

  return (
    <div className="restaurants-section">
      <div className="restaurants-header">
        <h2>{title}</h2>
        {showMore && (
          <button className="more" onClick={() => navigate("/foodmain")}>
            More
          </button>
        )}
      </div>

      <div
        className={`restaurant-cards-container ${variant === "grid" ? "vertical" : ""}
                                                  ${variant === "row" ? "row" : ""}`}
      >
        {restaurants.map((r) => (
          <div className={`restaurant-card ${variant === "row" ? "row-card" : ""}`} key={r.id}>
            <img
              className="title"
              src={r.imageUrl || r.logoUrl || placeholder}
              alt={r.title}
              onError={(e) => {
                e.currentTarget.src = placeholder;
              }}
            />
            <div className="text-block">
              <h4>{r.title}</h4>
              <p>{r.category}</p>
              <p>
                <Deliver /> {r.deliveryTime} • {r.minOrderAmount}₩
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
