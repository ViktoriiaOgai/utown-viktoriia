import { useState } from "react";
import Location from "@/assets/icons/Location.svg";
import "@/pages/client/Home.css";
import MobileHeader from "@/components/UI/Header";
import "@/pages/client/FoodMain.css";
import PromoCards from "@/components/UI/PromoCards";
import Search from "@/components/UI/Search";
import SearchIcon from "@/assets/icons/search-normal.svg";
import CategoriesCards from "@/components/UI/CategoriesCards";
import EstablishmentsCards from "@/components/UI/EstablishmentsCards";
import "@/styles/layout.css";

export default function FoodMain() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [address] = useState(() => localStorage.getItem("address") || "");
  return (
    <div className="page-wrapper">
      <MobileHeader logoVariant="white" showBack backColor="white" bellColor="white" showBell />

      {/* Основной контейнер */}
      <div className="main-container">
        <div className="main-inner">
          <p className="p">
            <img className="location-icon" src={Location} alt="icon" />
            {address}
          </p>
          <Search placeholder="Search for cafes,restaurants and dishes" icon={SearchIcon} />
          <PromoCards variant="pagination" />
          <CategoriesCards
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          <EstablishmentsCards selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
}
