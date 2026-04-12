import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Location from "@/assets/icons/Location.svg";
import MobileHeader from "@/components/UI/Header";
import { useNotifications } from "@/services/useNotification";
import Search from "@/components/UI/Search";
import SearchIcon from "@/assets/icons/search-normal.svg";
import Candle from "@/assets/icons/candle.svg";
import { searchRestaurants } from "@/services/restaurantService";
import RestaurantCards from "@/components/UI/RestaurantCards";
import "@/pages/client/SearchPage.css";

type Restaurant = {
  id: number;
  title: string;
  category: string;
  description: string;
  minOrderAmount: number;
  deliveryTime: string;
  ratings?: number;
};

export default function SearchPage() {
  const { unreadCount } = useNotifications();
  const [address] = useState(() => localStorage.getItem("address") || "");

  const [params, setParams] = useSearchParams();

  const query = params.get("query") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "";

  const [results, setResults] = useState<Restaurant[]>([]);

  const [search, setSearch] = useState(query);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  //  API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await searchRestaurants(debouncedSearch);
        setResults(data);
      } catch (e) {
        console.error(e);
        setResults([]);
      }
    };
    if (debouncedSearch.trim() || category) {
      fetchData();
    }
  }, [debouncedSearch, category]);

  // фильтр + сортировка
  const filtered = results
    .filter((r) => (category ? r.category?.toLowerCase().includes(category.toLowerCase()) : true))
    .sort((a, b) => {
      if (sort === "minOrderAmount") return a.minOrderAmount - b.minOrderAmount;
      if (sort === "rating") return (b.ratings || 0) - (a.ratings || 0);
      return 0;
    });

  return (
    <div className="search-main">
      <MobileHeader
        showBack
        backColor="white"
        showBell
        bellColor="white"
        unreadCount={unreadCount}
        logoVariant="white"
      />

      <div className="mainContsearch">
        <div className="mainsearchInner">
          <p className="p-search">
            <img src={Location} />
            {address}
          </p>

          <Search
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);

              setParams({
                query: e.target.value,
                category,
                sort,
              });
            }}
            isSearchPage
            icon={SearchIcon}
            iconRight={Candle}
          />

          {!search.trim() && !category ? (
            <p className="what">What shall we search for?</p>
          ) : filtered.length === 0 ? (
            <p className="what">Nothing found</p>
          ) : (
            <RestaurantCards variant="row" data={filtered} showMore={false} title="" />
          )}
        </div>
      </div>
    </div>
  );
}
