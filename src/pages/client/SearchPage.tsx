import { useState, useEffect } from "react";
import Location from "@/assets/icons/Location.svg";
import "@/pages/client/Home.css";
import MobileHeader from "@/components/UI/Header";
import { useNotifications } from "@/services/useNotification";
import "@/pages/client/FoodMain.css";
import Search from "@/components/UI/Search";
import SearchIcon from "@/assets/icons/search-normal.svg";
import Candle from "@/assets/icons/candle.svg";
import "@/pages/client/SearchPage.css";
import { getErrorMessage } from "@/services/getErrorMessage";
import { searchRestaurants } from "@/services/restaurantService";
import RestaurantCards from "@/components/UI/RestaurantCards";
import { useLocation } from "react-router-dom";

type Restaurant = {
  id: number;
  title: string;
  description: string;
  category: string;
  deliveryTime: string;
  minOrderAmount: number;
  imageUrl: string;
};

export default function SearchPage() {
  const [results, setResults] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const { unreadCount } = useNotifications();
  const [address] = useState(() => localStorage.getItem("address") || "");
  const location = useLocation();

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const fetch = async () => {
      try {
        const filters = JSON.parse(localStorage.getItem("filters") || "{}");

        console.log("SEARCH:", search);
        console.log("FILTERS:", filters);

        const data = await searchRestaurants(search);

        console.log("RESULT:", data);

        setResults(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetch();
  }, [search]);
  return (
    <div className="search-main">
      <MobileHeader
        logoVariant="white"
        showBack
        backColor="white"
        bellColor="white"
        showBell
        unreadCount={unreadCount}
      />

      {/* Основной контейнер */}
      <div className="mainContsearch">
        <div className="mainsearchInner">
          <p className="p-search">
            <img className="location" src={Location} alt="icon" />
            {address}
          </p>
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            isSearchPage
            placeholder="Search for cafes,restaurants and dishes"
            icon={SearchIcon}
            iconRight={Candle}
          />
          {results.length === 0 ? (
            <p className="what">What shall we search for?</p>
          ) : (
            <RestaurantCards variant="row" data={results} title="" showMore={false} />
          )}
        </div>
      </div>
    </div>
  );
}
