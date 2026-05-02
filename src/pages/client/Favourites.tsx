import { useEffect, useState } from "react";
import RestaurantCards from "@/components/UI/RestaurantCards";
import MobileHeader from "@/components/UI/Header";
import { getFavorites } from "@/services/restaurantService";
import type { Restaurant } from "@/types/restaurant";
import "@/pages/client/Favourites.css";

type Favorite = {
  restaurant: Restaurant;
};
export default function Favourites() {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data: Favorite[] = await getFavorites();
        setFavorites(data.map((f) => f.restaurant)); // используем оба
      } catch (e) {
        console.error(e);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="favor">
      <MobileHeader showBack logoVariant="gradient" showBell bellColor="rgba(141, 141, 141, 1)" />

      <div className="mainCont">
        <div className="mainContInner">
          <h1 className="Hello">Your Favourites</h1>

          <RestaurantCards variant="grid" title="" data={favorites} />
        </div>
      </div>
    </div>
  );
}
