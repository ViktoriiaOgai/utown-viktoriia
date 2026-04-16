import RestaurantCards from "@/components/UI/RestaurantCards";
import MobileHeader from "@/components/UI/Header";
import { useNotifications } from "@/services/useNotification";
import "@/pages/client/EstablishPage.css";

import "@/pages/client/Favourites.css";

export default function EstablishPage() {
  const { unreadCount } = useNotifications();
  return (
    <div className="establish">
      <MobileHeader
        showBack
        logoVariant="gradient"
        showBell
        unreadCount={unreadCount}
        bellColor="rgba(141, 141, 141, 1)"
      />

      {/* Основной контейнер */}
      <div className="establishCont">
        <div className="establishContInner">
          <h1 className="Hello-establish">Establishments</h1>

          <RestaurantCards variant="grid1" title="" />
        </div>
      </div>
    </div>
  );
}
