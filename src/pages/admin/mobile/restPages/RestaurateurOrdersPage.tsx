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

  // 1. GET RESTAURANT
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

  // 2. GET ORDERS
  useEffect(() => {
    if (!restaurant) return;

    const loadOrders = async () => {
      try {
        const res = await api.get(
          `/orders/restaurant/${restaurant.id}?page=0&size=50&sort=date,desc`
        );

        const data = res.data.content ?? res.data ?? [];

        const ordersWithDetails = await Promise.all(
          data.map(async (order: Order) => {
            try {
              const detailsRes = await api.get(`/orders/${order.id}`);

              return {
                ...order,
                items: detailsRes.data.items ?? [],
              };
            } catch (e) {
              console.error(`Failed to load order ${order.id}`, e);

              return {
                ...order,
                items: [],
              };
            }
          })
        );

        setOrders(ordersWithDetails);
      } catch (e) {
        console.error("Ошибка загрузки заказов", e);
        setOrders([]);
      }
    };

    loadOrders();
  }, [restaurant]);

  // 3. FILTER BY TAB (ИСПРАВЛЕНО ПОД BACKEND)
  const filteredOrders = useMemo(() => {
    const activeStatuses = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"];

    const completedStatuses = ["DELIVERED", "CANCELLED"];

    return orders.filter((order) => {
      if (tab === "new") {
        return activeStatuses.includes(order.status);
      }

      if (tab === "completed") {
        return completedStatuses.includes(order.status);
      }

      return false;
    });
  }, [orders, tab]);

  // TAB SWITCH
  const handleTabChange = (newTab: "new" | "completed") => {
    setTab(newTab);
  };

  // ACCEPT ORDER
  const handleAcceptClick = (order: Order) => {
    setSelectedOrder(order);
  };
  const handleConfirmAccept = async () => {
    if (!selectedOrder) return;

    try {
      // меняем статус на CONFIRMED
      await api.put(`/orders/${selectedOrder.id}/status`, {
        status: "CONFIRMED",
      });

      // закрываем модалку
      setSelectedOrder(null);

      // переходим на страницу cooking
      navigate(`/restaurateur/orders/${selectedOrder.id}/cooking`);
    } catch (e) {
      console.error("Ошибка обновления статуса", e);
    }
  };

  // REFRESH
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
            onClick={() => handleTabChange("new")}
          >
            New / In Progress
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
