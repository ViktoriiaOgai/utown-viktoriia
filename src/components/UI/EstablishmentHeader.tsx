import placeholder from "@/assets/images/Ad 1.svg";
import "@/components/UI/EstablishmentHeader.css";
import Deliver from "@/assets/icons/deliver.svg?react";
import Verified from "@/assets/icons/Verified Icon.svg?react";
import Points from "@/assets/icons/Points.svg?react";
import Heart from "@/assets/icons/heart.svg?react";
import { getRestaurantAverageRating } from "@/services/restaurantService";
import { useEffect, useState, useRef } from "react";
import { isRestaurantFavorite } from "@/services/restaurantService";
import { removeFromFavorites } from "@/services/restaurantService";
import { addToFavorites } from "@/services/restaurantService";

type Props = {
  restaurant: Restaurant;
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

export default function EstablishmentHeader({ restaurant }: Props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const checkFavorite = async () => {
      if (!restaurant?.id) return;

      const isFav = await isRestaurantFavorite(restaurant.id);
      setLiked(isFav);
    };

    checkFavorite();
  }, [restaurant?.id]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFavorite = async () => {
    if (!restaurant?.id) return;

    const prev = liked;
    setLiked(!prev);

    try {
      if (prev) {
        await removeFromFavorites(restaurant.id);
      } else {
        await addToFavorites(restaurant.id);
      }
    } catch {
      setLiked((prev) => !prev); // откат если ошибка
    }
  };

  const [rating, setRating] = useState<number | null>(null);
  useEffect(() => {
    const fetchRating = async () => {
      if (!restaurant?.id) return;

      const avg = await getRestaurantAverageRating(restaurant.id);
      setRating(avg);
    };

    fetchRating();
  }, [restaurant?.id]);

  return (
    <>
      <div className="est-header">
        <img
          className="est-header-img"
          src={restaurant.imageUrl || restaurant.logoUrl || placeholder}
          alt={restaurant.title}
        />
        <div className="est-header-actions">
          <div className="badge">
            <Verified />
            <span>{rating ? rating.toFixed(1) : "—"}</span>
          </div>

          <div className="badge">
            <Deliver />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="dots-wrapper" ref={ref}>
            <button className="badge clickable" onClick={() => setOpenMenu((prev) => !prev)}>
              <Points />
            </button>
          </div>
          {openMenu && (
            <div className="dropdown">
              <div className="item">Call</div>
              <div className="item">Share</div>
              <div className="item danger">Report</div>
            </div>
          )}
          <button className={`badge clickable ${liked ? "liked" : ""}`} onClick={handleFavorite}>
            <Heart />
          </button>
        </div>
      </div>
      <div className="info">
        <h2 className="est-title">{restaurant.title}</h2>
        <p className="est-desc">{restaurant.description}</p>
        <p className="est-min">Min order: {restaurant.minOrderAmount}₩</p>
      </div>
    </>
  );
}
