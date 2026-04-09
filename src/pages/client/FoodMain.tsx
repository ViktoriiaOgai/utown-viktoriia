import { useState } from "react";
import Location from "@/assets/icons/Location.svg";
import "@/pages/client/Home.css";
import MobileHeader from "@/components/UI/Header";
import { useNotifications } from "@/services/useNotification";
import "@/pages/client/FoodMain.css";
import PromoCards from "@/components/UI/PromoCards";
import Search from "@/components/UI/Search";
import SearchIcon from "@/assets/icons/search-normal.svg";
import CategoriesCards from "@/components/UI/CategoriesCards";
import EstablishmentsCards from "@/components/UI/EstablishmentsCards";

export default function FoodMain() {
  const { unreadCount } = useNotifications();
  const [address] = useState(() => localStorage.getItem("address") || "");
  return (
    <div className="food-main">
      <MobileHeader
        logoVariant="white"
        showBack
        backColor="white"
        bellColor="white"
        showBell
        unreadCount={unreadCount}
      />

      {/* Основной контейнер */}
      <div className="mainContFood">
        <div className="mainFoodInner">
          <p className="p">
            <img className="location" src={Location} alt="icon" />
            {address}
          </p>
          <Search placeholder="Search for cafes,restaurants and dishes" icon={SearchIcon} />
          <PromoCards variant="pagination" />
          <CategoriesCards />
          <EstablishmentsCards />
        </div>
      </div>
    </div>
  );
}
