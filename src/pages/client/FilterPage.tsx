import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Search from "@/components/UI/Search";
import SearchIcon from "@/assets/icons/search-normal.svg";
import Candle from "@/assets/icons/candle.svg";
import { useNotifications } from "@/services/useNotification";
import MobileHeader from "@/components/UI/Header";
import  Location from "@/assets/icons/Location.svg";
import "@/pages/client/FilterPage.css";
import AuthBtn from "@/components/UI/AuthBtn";

export default function FiltersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const { unreadCount } = useNotifications();
     const [address] = useState(() => localStorage.getItem("address") || "");

  const applyFilters = () => {
  if (!category || category === "all") {
    localStorage.removeItem("filters");
  } else {
    localStorage.setItem(
      "filters",
      JSON.stringify({ category })
    );
  }

  navigate("/search");
};

  return (
    <div className="search-Filter">
    <MobileHeader logoVariant="white" showBack backColor= "white" bellColor="white" showBell unreadCount={unreadCount} />
        <div className="mainContFilter">
        <div className="mainFilterInner">
            <p className="p-Filter">
            <img className="location-Filter" src={Location} alt="icon"/>
             {address}
        </p>
        </div>
      <Search
          
        iconRight={Candle}
        />
      {/* CATEGORY */}
      <p className="filter-title">Filter</p>
      <div className="chips">
        {["all", "restaurant", "cafe"].map((item) => (
          <button
            key={item}
            className={category === item ? "chip active" : "chip"}
            onClick={() => setCategory(item === "all" ? "" : item)}
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