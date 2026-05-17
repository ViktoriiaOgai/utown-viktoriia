import { useState } from "react";
import MobileHeader from "@/components/UI/Header";
import AuthBtn from "@/components/UI/AuthBtn";

import "@/styles/layout.css";
import "@/pages/admin/mobile/restPages/AcceptCookingPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/services/api";

export default function AcceptCookingPage() {
  const [time, setTime] = useState(50);

  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  if (!orderId) return null;

  const orderIdNum = Number(orderId);

  const increaseTime = () => setTime((p) => p + 5);

  const decreaseTime = () => {
    if (time > 5) setTime((p) => p - 5);
  };

  const handleStartCooking = async () => {
    try {
      await api.put(`/orders/${orderIdNum}`, {
        status: "PREPARING",
        cookingTime: time,
      });

      navigate("/restaurateur/orders", { replace: true });
    } catch (e) {
      console.error("Ошибка обновления статуса", e);
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
        <div className="cooking-content">
          <label className="cooking-label">Specify cooking time</label>

          <div className="time-controls">
            <button className="time-btn" onClick={decreaseTime}>
              -
            </button>

            <span className="time-value">{time} min</span>

            <button className="time-btn" onClick={increaseTime}>
              +
            </button>
          </div>
        </div>

        <AuthBtn className="start-cooking-btn" onClick={handleStartCooking}>
          Start cooking
        </AuthBtn>
      </div>
    </>
  );
}
