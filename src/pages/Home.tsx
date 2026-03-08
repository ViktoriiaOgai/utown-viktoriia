import { useEffect, useState } from "react"; 
import axios from "axios";
import Icon from "@/assets/icons/Vector-1.svg";
import BellIcon from "@/components/UI/BellIcon";
import Weather from "@/components/UI/Weather";
import ShoppingCart from "@/assets/icons/shopping-cart.svg";
import ServicesCards from "@/components/UI/ServicesCards";
import PromoCards from "@/components/UI/PromoCards";
import RestaurantCards from "@/components/UI/RestaurantCards";

type Restaurant = {
  id: number;
  title: string;
  description: string;
  category: string;
  logoUrl: string;
  minOrderAmount: number;
  deliveryTime: string;
};

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const userProfile = { city: "Ansan", lat: 37.3349584, lon: 126.7918849 };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          "https://utown-api.habsida.net/api/public/restaurants",
          { params: { page: 0, size: 20 } }
        );
        setRestaurants(res.data.content || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="home">
      {/* Фоновая картинка */}
      <img className="splash-img" src="/Pic.svg" alt="Pic" />

      {/* Верхние иконки */}
      <div className="home-icons">
        <img src={Icon} alt="Icon" className="Icon center-icon" />
        <BellIcon />
      </div>

      {/* Основной контейнер */}
      <div className="mainCont">
        <div className="mainContInner">
          <h1 className="Hello">Hello, User!</h1>

          <div className="main-top-row">
            <Weather
              userCity={userProfile.city}
              lat={userProfile.lat}
              lon={userProfile.lon}
            />

            <div className="active-orders-card">
              <img src={ShoppingCart} alt="Cart" className="shopping" />
              <h3>Your active orders</h3>
            </div>
          </div>

          <ServicesCards />
          <PromoCards />
          <RestaurantCards />
        </div>
      </div>
    </div>
  );
}