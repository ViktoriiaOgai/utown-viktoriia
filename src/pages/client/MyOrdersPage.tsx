// pages/client/MyOrdersPage.tsx

import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import MobileHeader from "@/components/UI/Header";
import "@/pages/client/MyOrdersPage.css";
import type { Order } from "@/types/order";
import { useNavigate } from "react-router-dom";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders/paginated");

        const data = res.data.content ?? res.data ?? [];

        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load orders", e);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const activeOrders = useMemo(() => {
    const activeStatuses = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"];

    return orders.filter((order) => activeStatuses.includes(order.status));
  }, [orders]);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="gradient-loader" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <MobileHeader
        showBack
        showBell
        bellColor="white"
        backColor="white"
        logoVariant="white"
        title="My Orders"
      />

      <div className="main-container">
        <div className="my-orders-page">
          <h2>Active Orders</h2>

          {activeOrders.length === 0 ? (
            <p>No active orders</p>
          ) : (
            activeOrders.map((order) => (
              <div
                key={order.id}
                className="client-order-card"
                onClick={() => navigate(`/order/${order.id}/status`)}
              >
                <div className="client-order-top">
                  <span>{order.restaurantName}</span>

                  <span>{order.status}</span>
                </div>

                <div className="client-order-items">
                  {!order.items?.length ? (
                    <p>No items</p>
                  ) : (
                    order.items.map((item) => (
                      <div key={item.id} className="client-order-item">
                        <strong>
                          {item.dishTitle} x{item.count}
                        </strong>
                        <strong>{item.sum} won</strong>

                        {!!item.elements?.length && (
                          <div className="client-order-sub">{item.elements.join(", ")}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="client-order-total">{order.totalSum} KRW</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
