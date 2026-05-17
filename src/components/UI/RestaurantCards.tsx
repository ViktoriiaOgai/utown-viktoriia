import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "@/components/UI/RestaurantCards.css";
import placeholder from "@/assets/images/Ad 1.svg";
import Deliver from "@/assets/icons/deliver.svg?react";

import type { Restaurant } from "@/types/restaurant";
import { useRestaurantsData } from "@/hooks/useRestaurantsData";
import { getErrorMessage } from "@/services/getErrorMessage";

type Props = {
  variant?: "scroll" | "grid" | "row" | "grid1" | "header";
  title?: string;
  data?: Restaurant[];
  showMore?: boolean;
  onMoreClick?: () => void;
  selectedCategory?: string | null;
  onlyFavorites?: boolean;
};

export default function RestaurantCards({
  variant = "scroll",
  title = "Food Delivery",
  data,
  showMore = false,
  onMoreClick,
  selectedCategory,
  onlyFavorites = false,
}: Props) {
  const navigate = useNavigate();

  const restaurantsFromHook = useRestaurantsData();
  const restaurantsToRender = data ?? restaurantsFromHook;

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
        className={`restaurant-cards-container ${
          variant === "grid" ? "vertical" : ""
        } ${variant === "row" ? "row" : ""} ${variant === "grid1" ? "vertical1" : ""}`}
      >
        {filteredRestaurants.map((r) => (
          <div
            key={r.id}
            className={`restaurant-card ${!r.isActive ? "disabled" : ""}`}
            onClick={() => {
              if (!r.isActive) return;

              try {
                navigate(`/establishment/${r.id}`);
              } catch (error) {
                console.error(getErrorMessage(error));
              }
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

              {r.isActive === false ? (
                <span className="closed-badge">Closed</span>
              ) : (
                <span className="open-badge">Open</span>
              )}

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
