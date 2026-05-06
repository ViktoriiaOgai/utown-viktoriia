// components/UI/RestaurantCards.tsx
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import "@/components/UI/RestaurantCards.css";
import placeholder from "@/assets/images/Ad 1.svg";
import Deliver from "@/assets/icons/deliver.svg?react";
import { getErrorMessage } from "@/services/getErrorMessage";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import type { Restaurant } from "@/types/restaurant";

type Props = {
  variant?: "scroll" | "grid" | "row" | "grid1" | "header";
  title?: string;
  data?: Restaurant[];
  showMore?: boolean;
  onMoreClick?: () => void;
  selectedCategory?: string | null;
  onlyFavorites?: boolean;
};

type FavoriteResponse = {
  restaurant: Restaurant;
};

const API_URL = import.meta.env.VITE_API_URL;
export default function RestaurantCards({
  variant = "scroll",
  title = "Food Delivery",
  data,
  showMore = false,
  onMoreClick,
  selectedCategory,
  onlyFavorites = false,
}: Props) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();
  const restaurantsToRender = data ?? restaurants;

  const filteredRestaurants = useMemo(() => {
    let result = restaurantsToRender;

    if (selectedCategory) {
      result = result.filter((r) => r.category === selectedCategory);
    }

    if (onlyFavorites) {
      result = result.filter((r) => r.isFavorite);
    }

    return result;
  }, [restaurantsToRender, selectedCategory, onlyFavorites]);

  useEffect(() => {
    if (data) return;

    const fetchRestaurants = async () => {
      try {
        if (onlyFavorites) {
          const res = await api.get(`${API_URL}/favorites`);

          // API возвращает не рестораны, а обертку
          const mapped = res.data.map((f: FavoriteResponse) => ({
            ...f.restaurant,
            isFavorite: true,
          }));

          setRestaurants(mapped);
        } else {
          const res = await api.get(`${API_URL}/public/restaurants`);
          setRestaurants(res.data.content || []);
        }
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("Ошибка загрузки ресторанов:", message);
      }
    };

    fetchRestaurants();
  }, [data, onlyFavorites]);

  return (
    <div className="restaurants-section">
      <div className="restaurants-header">
        <h2>{title}</h2>
        {showMore && (
          <button className="more" onClick={onMoreClick}>
            More
          </button>
        )}
      </div>

      <div
        className={`restaurant-cards-container ${variant === "grid" ? "vertical" : ""}
                                                  ${variant === "row" ? "row" : ""}
                                                ${variant === "grid1" ? "vertical1" : ""}`}
      >
        {filteredRestaurants.map((r) => (
          <div
            className={`restaurant-card ${variant === "row" ? "row-card" : ""} ${!r.isActive ? "disabled" : ""}`}
            onClick={() => {
              if (!r.isActive) return;
              navigate(`/establishment/${r.id}`);
            }}
          >
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
              {r.isActive === false && <span className="closed-badge">Closed</span>}

              {r.isActive !== false && <span className="open-badge">Open</span>}
              {variant === "grid1" ? (
                <>
                  <div className="est-row">
                    <p>{r.description}</p>
                    <button className="time">{r.deliveryTime}</button>
                  </div>
                </>
              ) : (
                <>
                  <p>{r.category}</p>
                  <p>
                    <Deliver /> {r.deliveryTime} • {r.minOrderAmount}₩
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
