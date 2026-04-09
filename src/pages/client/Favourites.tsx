import RestaurantCards from "@/components/UI/RestaurantCards";
import MobileHeader from "@/components/UI/Header";
import { useNotifications } from "@/services/useNotification";

import "@/pages/client/Favourites.css";

export default function Favourites() {
  const { unreadCount } = useNotifications();
  return (
    <div className="favor">
      <MobileHeader
        showBack
        logoVariant="gradient"
        showBell
        unreadCount={unreadCount}
        bellColor="rgba(141, 141, 141, 1)"
      />

      {/* Основной контейнер */}
      <div className="mainCont">
        <div className="mainContInner">
          <h1 className="Hello">Your Favourites</h1>

          <RestaurantCards variant="grid"  title = "" />
        </div>
      </div>
    </div>
  );
}
