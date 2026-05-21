import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/services/api";
import MobileHeader from "@/components/UI/Header";
import { OrderCard } from "../restComponents/OrderCard";
import type { Order } from "@/types/order";
import OrderNumTime from "../restComponents/OrderNumTime";
import "@/pages/admin/mobile/restComponents/OrderNumTime.css";
import { OrderTimeline } from "@/pages/admin/mobile/restComponents/OrderTimeline";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

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
      {/* reuse OrderCard but "detail mode" */}
      <OrderCard
        order={order}
        tab="new"
        onAccept={() => {}}
        isDetails //добавим режим (ниже объясню)
      />
    </>
  );
}
