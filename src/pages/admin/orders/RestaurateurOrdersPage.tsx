import { useEffect, useState } from "react";
import { api } from "@/services/api";

type Order = {
  id: number;
  userName: string;
  totalSum: number;
};

type Restaurant = {
  id: number;
};

export default function RestaurateurOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    // 1. получаем ресторан текущего пользователя
    api.get("/restaurant-owner/restaurants/my").then((res) => {
      setRestaurant(res.data);
    });
  }, []);

  useEffect(() => {
    if (!restaurant) return;

    // 2. получаем заказы этого ресторана
    api.get(`/orders/restaurant/${restaurant.id}`).then((res) => {
      setOrders(res.data);
    });
  }, [restaurant]);

  return (
    <div className="mobile-screen">
      <h2>Orders</h2>

      {orders.length === 0 ? (
        <p>No orders</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="mobile-card">
            <div>Client: {order.userName}</div>
            <div>Amount: {order.totalSum}</div>
          </div>
        ))
      )}
    </div>
  );
}
