import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/services/api";
import "@/pages/client/OrderPaymentPage.css";
import "@/styles/layout.css";
import MobileHeader from "@/components/UI/Header";
import { useNotifications } from "@/services/useNotification";
import AuthBtn from "@/components/UI/AuthBtn";
import Prepared from "@/assets/images/PreaparedOrder.svg?react";
import IllDEliver from "@/assets/images/Illustration.svg?react";
import Conf from "@/assets/images/Conf.png";
import DeliverOk from "@/assets/images/Deliveryok.svg?react";
import { Orders } from "@/types/restaurant";

export default function OrderStatusPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { refetch } = useNotifications();

  const [order, setOrder] = useState<Orders | null>(null);
  const [isError, setIsError] = useState(false);
  const prevStatusRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    attemptsRef.current = 0;
    const fetchOrder = async () => {
      // СБРОС ОШИБКИ ЗДЕСЬ
      // вызов внутри функции, а не напрямую в теле useEffect
      if (attemptsRef.current === 0) {
        setIsError(false);
      }

      try {
        const res = await api.get<Orders>(`/orders/${id}`);
        if (!isMounted) return;

        const data = res.data;
        if (!data) return;

        const newStatus = data.status ?? "PENDING";

        if (prevStatusRef.current && prevStatusRef.current !== newStatus) {
          refetch();
        }

        prevStatusRef.current = newStatus;
        setOrder(data);

        if (newStatus === "DELIVERED" || newStatus === "CANCELLED") {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (e: unknown) {
        if (!isMounted) return;
        attemptsRef.current += 1;
        console.error("Polling error:", e);
        if (attemptsRef.current >= 3) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsError(true);
        }
      }
    };

    fetchOrder();
    intervalRef.current = setInterval(fetchOrder, 3000);

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [id, refetch]);

  const statusMap: Record<string, string> = {
    PENDING: "Order confirming by the restaurant",
    CONFIRMED: "Order confirmed",
    PREPARING: "Restaurant is preparing your order",
    READY: "Order is ready",
    OUT_FOR_DELIVERY: "Courier is on the way",
    DELIVERED: "Order delivered",
    CANCELLED: "Order cancelled",
  };

  const statusImageMap: Record<string, string | React.FC | null> = {
    PENDING: null,
    CONFIRMED: Conf,
    PREPARING: Prepared,
    READY: Prepared,
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
  const isInitialStatus = currentStatus === "PENDING";
  const ImageComponent = statusImageMap[currentStatus];

  if (!order) {
    return (
      <div className="loader-wrapper">
        <div className="gradient-loader" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <MobileHeader showBack backColor="white" showBell bellColor="white" logoVariant="white" />

      {isInitialStatus ? (
        <div className="loader-wrapper">
          <div className="gradient-loader" />
        </div>
      ) : (
        ImageComponent && (
          <div className="status-image-wrapper">
            {typeof ImageComponent === "string" ? (
              <img src={ImageComponent} alt="status" className="status-image" />
            ) : (
              <ImageComponent />
            )}
          </div>
        )
      )}

      <div className="status-container">
        <div className="status-screen">
          {isError && (
            <div style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
              Connection lost. Please refresh the page.
            </div>
          )}
          <h2>{order.deliveryTime}</h2>
          <p className="commit">minutes until delivery</p>
          <p className="restName">{order.restaurantName}</p>

          <h3>{statusMap[currentStatus]}</h3>
          <p className="commit">{statusDescription[currentStatus]}</p>

          <Link to="/profile/contact">Contact support</Link>
        </div>

        <div className="pay-container">
          <AuthBtn onClick={() => navigate("/my-orders")}>Hide Order Status</AuthBtn>
        </div>
      </div>
    </div>
  );
}
