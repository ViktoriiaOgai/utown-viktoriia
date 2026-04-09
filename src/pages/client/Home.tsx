import { useState } from "react";
import Weather from "@/components/UI/Weather";
import ShoppingCart from "@/assets/icons/shopping-cart.svg";
import ServicesCards from "@/components/UI/ServicesCards";
import PromoCards from "@/components/UI/PromoCards";
import RestaurantCards from "@/components/UI/RestaurantCards";
import Pic from "@/assets/images/Pic.svg";
import "@/pages/client/Home.css";
import MobileHeader from "@/components/UI/Header";
import { getUserName } from "@/hooks/auth";
import { useNotifications } from "@/services/useNotification";

export default function Home() {
  const userProfile = { city: "Ansan", lat: 37.3349584, lon: 126.7918849 };
  const [firstName] = useState(() => getUserName() || "");
  const { unreadCount } = useNotifications();

  return (
    <div className="home">
      {/* Фоновая картинка */}
      <img className="splash-img2" src={Pic} alt="Pic" />

      <MobileHeader logoVariant="white" bellColor="white" showBell unreadCount={unreadCount} />

      {/* Основной контейнер */}
      <div className="mainCont">
        <div className="mainContInner">
          <h1 className="Hello">Hello{firstName ? `, ${firstName}` : ""}!</h1>

          <div className="main-top-row">
            <Weather userCity={userProfile.city} lat={userProfile.lat} lon={userProfile.lon} />

            <div className="active-orders-card">
              <img src={ShoppingCart} alt="Cart" className="shopping" />
              <h3>Your active orders</h3>
            </div>
          </div>

          <ServicesCards />
          <PromoCards />
          <RestaurantCards showMore/>
        </div>
      </div>
    </div>
  );
}
