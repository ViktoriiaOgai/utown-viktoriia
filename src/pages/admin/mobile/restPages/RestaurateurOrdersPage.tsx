import { useEffect, useState } from "react";
import { api } from "@/services/api";
import MobileHeader from "@/components/UI/Header";
import "@/pages/admin/mobile/restPages/RestaurateurOrdersPage.css";
import Rotate from "@/assets/icons/Rotate Icon.svg?react";
import { OrderCard } from "../restComponents/OrderCard";
import Modal from "@/components/UI/Modal";
import { Order } from "@/types/order";

type Restaurant = {
  id: number;
};

export default function RestaurateurOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [tab, setTab] = useState<"new" | "completed">("new");

  // 👇 ДОБАВИЛИ refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // =========================
  // 1. GET RESTAURANT
  // =========================
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const userRes = await api.get("/users/profile");
        const userId = userRes.data.id;

        const restRes = await api.get("/restaurant-owner/restaurants", {
          params: { userId },
        });

        if (restRes.data?.length) {
          setRestaurant(restRes.data[0]);
        }
      } catch (e) {
        console.error("Ошибка получения ресторана", e);
      }
    };

    fetchRestaurant();
  }, []);

  // =========================
  // 2. GET ORDERS
  // =========================
  useEffect(() => {
    if (!restaurant) return;

    const loadOrders = async () => {
      try {
        let res;

        if (tab === "new") {
          res = await api.get(`/orders/restaurant/${restaurant.id}/active`);
          setOrders(Array.isArray(res.data) ? res.data : []);
        } else {
          res = await api.get(`/orders/restaurant/${restaurant.id}?page=0&size=20&sort=date,desc`);
          setOrders(Array.isArray(res.data.content) ? res.data.content : []);
        }
      } catch (e) {
        console.error("Ошибка загрузки заказов", e);
        setOrders([]);
      }
    };

    loadOrders();
  }, [restaurant, tab, refreshKey]);

  // =========================
  // FILTER
  // =========================
  const filteredOrders = orders.filter((order) =>
    tab === "new"
      ? order.status === "NEW" || order.status === "ACCEPTED"
      : order.status === "COMPLETED"
  );

  // =========================
  // TAB SWITCH
  // =========================
  const handleTabChange = (newTab: "new" | "completed") => {
    setTab(newTab);
  };

  // =========================
  // ACCEPT ORDER
  // =========================
  const handleAcceptClick = (id: number) => {
    setSelectedOrderId(id);
  };

  const handleConfirmAccept = async () => {
    if (!selectedOrderId) return;

    try {
      await api.put(`/orders/${selectedOrderId}/status`, {
        status: "ACCEPTED",
      });

      setSelectedOrderId(null);
      setRefreshKey((prev) => prev + 1); // 🔥 нормальный refresh
    } catch (e) {
      console.error("Ошибка обновления статуса", e);
    }
  };

  // =========================
  // REFRESH BUTTON
  // =========================
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // 🔥 правильно
  };

  return (
    <>
      <MobileHeader
        showBack
        backColor="black"
        logoVariant="title-black"
        title=".BUSINESS"
        titleColor="black"
      />

      <div className="main-container">
        <div className="main-title">
          <h2>Order Table</h2>

          <button className="rotate-btn" onClick={handleRefresh}>
            <Rotate className="rotate" />
          </button>
        </div>

        <div className="ordStatusBtn">
          <button
            className={`statusBtn ${tab === "new" ? "active" : ""}`}
            onClick={() => handleTabChange("new")}
          >
            New/InProgress
          </button>

          <button
            className={`statusBtn ${tab === "completed" ? "active" : ""}`}
            onClick={() => handleTabChange("completed")}
          >
            Completed
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <p style={{ padding: "16px" }}>No orders</p>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} tab={tab} onAccept={handleAcceptClick} />
          ))
        )}
      </div>

      {selectedOrderId && (
        <Modal
          title="Accept the order"
          message={`Order #${selectedOrderId}`}
          onCancel={() => setSelectedOrderId(null)}
          onAccept={handleConfirmAccept}
        />
      )}
    </>
  );
}
