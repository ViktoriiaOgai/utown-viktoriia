import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/services/api";
import "@/pages/client/OrderPaymentPage.css";
import "@/styles/layout.css";
import MobileHeader from "@/components/UI/Header";
import { useNotifications } from "@/services/useNotification";
import AuthBtn from "@/components/UI/AuthBtn";
import Order from "@/assets/images/Order.svg?react";
import IllDEliver from "@/assets/images/Illustration.svg?react";
import DeliverOk from "@/assets/images/Deliveryok.svg?react";
import { useNavigate, Link } from "react-router-dom";
import { Orders } from "@/types/restaurant";

export default function OrderStatusPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { unreadCount } = useNotifications();
  const [order, setOrder] = useState<Orders | null>(null);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get<Orders>(`/orders/${id}`);
        setOrder(res.data);

        if (res.data.status === "DELIVERED" || res.data.status === "CANCELLED") {
          clearInterval(interval);
        }
      } catch (e) {
        console.error(e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  const statusMap: Record<string, string> = {
    PENDING: "Order confirming by the restaurant",
    CONFIRMED: "Order confirmed",
    PREPARING: "Restaurant is preparing your order",
    READY: "Order is ready",
    OUT_FOR_DELIVERY: "Courier is on the way",
    DELIVERED: "Order delivered",
    CANCELLED: "Order cancelled",
  };
  const statusImageMap: Record<string, React.FC | null> = {
    PENDING: null,
    CONFIRMED: null,

    PREPARING: Order,
    READY: Order,

    OUT_FOR_DELIVERY: IllDEliver,

    DELIVERED: DeliverOk,
    CANCELLED: DeliverOk,
  };
  const statusDescription: Record<string, string> = {
    PENDING: "Waiting for restaurant confirmation",
    CONFIRMED: "Restaurant confirmed your order",
    PREPARING: "Your food is being prepared",
    OUT_FOR_DELIVERY: "Courier is on the way",
    DELIVERED: "Enjoy your meal!",
    CANCELLED: "Order was cancelled",
  };
  const currentStatus = order?.status || "PENDING";
  const ImageComponent = statusImageMap[currentStatus];
  return (
    <div className="page-wrapper">
      <MobileHeader
        showBack
        backColor="white"
        showBell
        bellColor="white"
        unreadCount={unreadCount}
        logoVariant="white"
      />
      {currentStatus === "PENDING" || currentStatus === "CONFIRMED" ? (
        <div className="loader-wrapper">
          <div className="gradient-loader" />
        </div>
      ) : (
        ImageComponent && <ImageComponent />
      )}
      <div className="status-container">
        <div className="status-screen">
          <h2>{order?.deliveryTime}</h2>
          <p className="commit">minutes until delivery</p>
          <p className="restName">{order?.restaurantName}</p>
          <h3>{statusMap[order?.status || "PENDING"]} </h3>
          <p className="commit">{statusDescription[order?.status || "PENDING"]}</p>

          <Link to="/profile/contact">Contact support</Link>
        </div>
        <div className="pay-container">
          <AuthBtn onClick={() => navigate("/foodmain")}>Hide Order Status</AuthBtn>
        </div>
      </div>
    </div>
  );
}
