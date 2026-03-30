import RestaurantCards from "@/components/UI/RestaurantCards";
import MobileHeader from "@/components/UI/Header";

import "@/pages/Favourites.css";

export default function Favourites() {
  return (
    <div className="favor">
      <MobileHeader showBack logoVariant="gradient" bellColor="#9ca3af" />

      {/* Основной контейнер */}
      <div className="mainCont">
        <div className="mainContInner">
          <h1 className="Hello">Your Favourites</h1>

          <RestaurantCards />
        </div>
      </div>
    </div>
  );
}
