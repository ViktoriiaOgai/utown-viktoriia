// components/UI/RestaurantCards.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import "@/App.css"

type Restaurant = {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  category: string;
  minOrderAmount: number;
  deliveryTime: string;
};

export default function RestaurantCards() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          "https://utown-api.habsida.net/api/public/restaurants"
        );
        setRestaurants(res.data.content || []);
      } catch (err) {
        console.error("Ошибка загрузки ресторанов", err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="restaurants-section">
  <div className="restaurants-header">
    <h2>Food Delivery</h2>
    <button className="more-btn">More</button>
  </div>
  
    <div className="restaurant-cards-container">
      {restaurants.map((r) => (
        <div className="restaurant-card" key={r.id}>
          <img src={r.logoUrl} alt={r.name} />
          <h4>{r.name}</h4>
          <p>{r.category}</p>
          <p>От {r.minOrderAmount}₩ • {r.deliveryTime}</p>
        </div>
      ))}
    </div>
    </div>
  );
}