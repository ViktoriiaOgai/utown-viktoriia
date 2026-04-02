import RestaurantCards from "@/components/UI/RestaurantCards";
import MobileHeader from "@/components/UI/Header";

import "@/pages/client/Favourites.css";

export default function Favourites() {
  return (
    <div className="favor">
      <MobileHeader showBack logoVariant="gradient" showBell bellColor="rgba(141, 141, 141, 1)" />

      {/* Основной контейнер */}
      <div className="mainCont">
        <div className="mainContInner">
          <h1 className="Hello">Your Favourites</h1>

          <RestaurantCards variant="grid" />
        </div>
      </div>
    </div>
  );
}
