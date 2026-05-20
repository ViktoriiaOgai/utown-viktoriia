import { useEffect, useState, useMemo } from "react";
import { api } from "@/services/api";
import MobileHeader from "@/components/UI/Header";
import "@/pages/admin/mobile/restPages/RestaurateurOrdersPage.css";
import Rotate from "@/assets/icons/Rotate Icon.svg?react";
import { OrderCard } from "../restComponents/OrderCard";
import Modal from "@/components/UI/Modal";
import type { Order } from "@/types/order";
import { useNavigate } from "react-router-dom";

type Restaurant = {
  id: number;
};

export default function RestaurateurOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [tab, setTab] = useState<"new" | "completed">("new");

  const navigate = useNavigate();

  // ---------------- RESTAURANT ----------------
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const userRes = await api.get("/users/profile");

        const restRes = await api.get("/restaurant-owner/restaurants", {
          params: { userId: userRes.data.id },
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

  // ---------------- ORDERS ----------------
  useEffect(() => {
    if (!restaurant) return;

    const loadOrders = async () => {
      try {
        const res = await api.get(
          `/orders/restaurant/${restaurant.id}?page=0&size=50&sort=date,desc`
        );

        const data = res.data.content ?? res.data ?? [];

        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Ошибка загрузки заказов", e);
        setOrders([]);
      }
    };

    loadOrders();
  }, [restaurant]);

  // ---------------- AUTO REFRESH ON FOCUS ----------------
  useEffect(() => {
    if (!restaurant) return;

    const loadOrders = async () => {
      try {
        const res = await api.get(
          `/orders/restaurant/${restaurant.id}?page=0&size=50&sort=date,desc`
        );

        const data = res.data.content ?? res.data ?? [];
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Ошибка обновления", e);
      }
    };

    const onFocus = () => loadOrders();

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [restaurant]);

  // ---------------- FILTER ----------------
  const filteredOrders = useMemo(() => {
    const activeStatuses = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"];

    const completedStatuses = ["DELIVERED", "CANCELLED"];

    return orders.filter((order) =>
      tab === "new"
        ? activeStatuses.includes(order.status)
        : completedStatuses.includes(order.status)
    );
  }, [orders, tab]);

  // ---------------- ACCEPT ----------------
  const handleAcceptClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleConfirmAccept = async () => {
    if (!selectedOrder) return;

    try {
      await api.put(`/orders/${selectedOrder.id}/status`, {
        status: "CONFIRMED",
      });

      setSelectedOrder(null);

      // refresh
      if (restaurant) {
        const res = await api.get(
          `/orders/restaurant/${restaurant.id}?page=0&size=50&sort=date,desc`
        );

        const data = res.data.content ?? res.data ?? [];
        setOrders(Array.isArray(data) ? data : []);
      }

      navigate(`/restaurateur/orders/${selectedOrder.id}/cooking`);
    } catch (e) {
      console.error("Ошибка обновления статуса", e);
    }
  };

  // ---------------- REFRESH ----------------
  const handleRefresh = async () => {
    if (!restaurant) return;

    try {
      const res = await api.get(
        `/orders/restaurant/${restaurant.id}?page=0&size=50&sort=date,desc`
      );

      const data = res.data.content ?? res.data ?? [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Ошибка обновления", e);
    }
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
            onClick={() => setTab("new")}
          >
            New / In Progress
          </button>

          <button
            className={`statusBtn ${tab === "completed" ? "active" : ""}`}
            onClick={() => setTab("completed")}
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

      {selectedOrder && (
        <Modal
          title={`${selectedOrder.number}`}
          message={`Accept the order for processing?`}
          onCancel={() => setSelectedOrder(null)}
          onAccept={handleConfirmAccept}
        />
      )}
    </>
  );
}
