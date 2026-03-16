// components/UI/RestaurantCards.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/RestaurantCards.css";
import placeholder from "@/assets/images/Ad 1.svg";
import Deliver from "@/assets/icons/deliver.svg?react"

type Restaurant = {
  id: number;
  title: string;
  description: string;
  logoUrl: string;
  category: string;
  minOrderAmount: number;
  deliveryTime: string;
  imageUrl: string;
};

export default function RestaurantCards() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${API_URL}/public/restaurants`);
      setRestaurants(res.data.content || []);
    } catch (err) {
      console.error("Ошибка загрузки ресторанов", err);
    }
  };

  fetchRestaurants();
}, [API_URL]);

  return (
    <div className="restaurants-section">
  <div className="restaurants-header">
    <h2>Food Delivery</h2>
    <button className="more-btn">More</button>
  </div>
  
    <div className="restaurant-cards-container">
      {restaurants.map((r) => (
        <div className="restaurant-card" key={r.id}>
          <img className="title"
  src={r.imageUrl || placeholder}
  alt={r.title}
  onError={(e) => {
    e.currentTarget.src = placeholder;
  }}
/>
          <h4 className="title">{r.title}</h4>
          <p className="categ">{r.category}</p>
          <p className="categ"> <Deliver/> {r.minOrderAmount}₩ • {r.deliveryTime}</p>
        </div>
      ))}
    </div>
    </div>
  );
}