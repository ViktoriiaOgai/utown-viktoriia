import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Search from "@/components/UI/Search";
import Candle from "@/assets/icons/candle.svg";
import { useNotifications } from "@/services/useNotification";
import MobileHeader from "@/components/UI/Header";
import Location from "@/assets/icons/Location.svg";
import "@/pages/client/FilterPage.css";
import AuthBtn from "@/components/UI/AuthBtn";

export default function FiltersPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { unreadCount } = useNotifications();
  const [address] = useState(() => localStorage.getItem("address") || "");

  //  берём из URL
  const [category, setCategory] = useState(params.get("category") || "all");
  const [sort, setSort] = useState(params.get("sort") || "recommended");

  const applyFilters = () => {
    const query = params.get("query") || "";

    navigate(`/search?query=${query}&category=${category === "all" ? "" : category}&sort=${sort}`);
  };

  return (
    <div className="search-Filter">
      <MobileHeader
        logoVariant="white"
        showBack
        backColor="white"
        bellColor="white"
        showBell
        unreadCount={unreadCount}
      />

      <div className="mainContFilter">
        <div className="mainFilterInner">
          <p className="p-Filter">
            <img className="location-Filter" src={Location} alt="icon" />
            {address}
          </p>
        </div>

        <Search iconRight={Candle} />

        {/* CATEGORY */}
        <p className="filter-title">Filter by category</p>
        <div className="chips">
          {["all", "Pizza", "Fast Food", "burgers", "Japanese"].map((item) => (
            <button
              key={item}
              className={category === item ? "chip active" : "chip"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* SORT */}
        <p className="filter-title">Sort by</p>
        <div className="chips">
          {["recommended", "rating", "minOrderAmount"].map((item) => (
            <button
              key={item}
              className={sort === item ? "chip active" : "chip"}
              onClick={() => setSort(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <AuthBtn onClick={applyFilters}>Close</AuthBtn>
      </div>
    </div>
  );
}
