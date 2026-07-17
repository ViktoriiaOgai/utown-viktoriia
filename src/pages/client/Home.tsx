import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Weather from "@/components/UI/Weather";
import ShoppingCart from "@/assets/icons/shopping-cart.svg";
import ServicesCards from "@/components/UI/ServicesCards";
import PromoCards from "@/components/UI/PromoCards";
import RestaurantCards from "@/components/UI/RestaurantCards";
import Pic from "@/assets/images/Pic.svg";
import "@/pages/client/Home.css";
import MobileHeader from "@/components/UI/Header";
import { getUserName } from "@/hooks/auth";

export default function Home() {
  const [firstName] = useState(() => getUserName() || "");
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Фоновая картинка */}
      <img className="splash-img2" src={Pic} alt="Pic" />

      <MobileHeader logoVariant="white" bellColor="white" showBell />

      {/* Основной контейнер */}
      <div className="mainCont">
        <div className="mainContInner">
          <h1 className="Hello">Hello{firstName ? `, ${firstName}` : ""}!</h1>

          <div className="main-top-row">
            <Weather />

            <div className="active-orders-card" onClick={() => navigate("/my-orders")}>
              <img src={ShoppingCart} alt="Cart" className="shopping" />

              <h3>Your active orders</h3>
            </div>
          </div>

          <ServicesCards />
          <PromoCards />
          <RestaurantCards showMore onMoreClick={() => navigate("/foodmain")} />
        </div>
      </div>
    </div>
  );
}
