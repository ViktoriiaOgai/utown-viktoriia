import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/services/api";
import MobileHeader from "@/components/UI/Header";
import { OrderCard } from "../restComponents/OrderCard";
import type { Order } from "@/types/order";
import OrderNumTime from "../restComponents/OrderNumTime";
import "@/pages/admin/mobile/restComponents/OrderNumTime.css";
import { OrderTimeline } from "@/pages/admin/mobile/restComponents/OrderTimeline";
import Modal from "@/components/UI/Modal";

export default function OrderDetailsPage() {
  const { orderId } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);

        setOrder({
          ...res.data,
          items: res.data.items ?? [],
        });
      } catch (e) {
        console.error("Failed to load order", e);
      }
    };

    if (orderId) load();
  }, [orderId]);

  // открыть модалку
  const handleAcceptClick = (order: Order) => {
    setSelectedOrder(order);
  };

  // подтвердить accept
  const handleConfirmAccept = async () => {
    if (!selectedOrder) return;

    try {
      await api.put(`/orders/${selectedOrder.id}/status`, {
        status: "CONFIRMED",
      });

      setSelectedOrder(null);

      navigate(`/restaurateur/orders/${selectedOrder.id}/cooking`);
    } catch (e) {
      console.error("Ошибка обновления статуса", e);
    }
  };

  if (!order) {
    return <p style={{ padding: 16 }}>Loading...</p>;
  }

  return (
    <>
      <MobileHeader
        showBack
        backColor="black"
        logoVariant="title-black"
        title=".BUSINESS"
        titleColor="black"
      />

      <div className="order-details-wrapper">
        <OrderNumTime order={order} variant="details" />
      </div>

      <OrderTimeline order={order} />

      <OrderCard order={order} tab="new" onAccept={handleAcceptClick} isDetails />

      {selectedOrder && (
        <Modal
          title={`${selectedOrder.number}`}
          message="Accept the order for processing?"
          onCancel={() => setSelectedOrder(null)}
          onAccept={handleConfirmAccept}
        />
      )}
    </>
  );
}
