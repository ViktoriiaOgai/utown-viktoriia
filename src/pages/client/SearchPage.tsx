import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Location from "@/assets/icons/Location.svg";
import MobileHeader from "@/components/UI/Header";
import Search from "@/components/UI/Search";
import SearchIcon from "@/assets/icons/search-normal.svg";
import Candle from "@/assets/icons/candle.svg";
import { searchRestaurants } from "@/services/restaurantService";
import RestaurantCards from "@/components/UI/RestaurantCards";
import "@/pages/client/SearchPage.css";
import "@/styles/layout.css";

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
        const data = await searchRestaurants({
          title: debouncedSearch,
          category,
        });
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

  return (
    <div className="page-wrapper">
      <MobileHeader showBack backColor="white" showBell bellColor="white" logoVariant="white" />

      <div className="main-container">
        <div className="main-inner">
          <p className="location-row">
            <img src={Location} />
            {address}
          </p>

          <Search
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);

              setParams(
                {
                  query: e.target.value,
                  category,
                  sort,
                },
                { replace: true }
              );
            }}
            isSearchPage
            icon={SearchIcon}
            iconRight={Candle}
          />

          {!search.trim() && !category ? (
            <p className="empty-text">What shall we search for?</p>
          ) : results.length === 0 ? (
            <p className="empty-text">Nothing found</p>
          ) : (
            <RestaurantCards variant="row" data={results} showMore={false} title="" />
          )}
        </div>
      </div>
    </div>
  );
}
