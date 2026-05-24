import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileHeader from "@/components/UI/Header";
import AuthBtn from "@/components/UI/AuthBtn";
import { api } from "@/services/api";
import type { Order } from "@/types/order";
import { OrderCard } from "../restComponents/OrderCard";

import "@/pages/admin/mobile/restPages/RejectOrderPage.css";

const reasons = [
  "The first reason is you",
  "And the second is all your dreams",
  "The third is all your words",
  "I hardly believed them",
];

export default function RejectOrderPage() {
  const navigate = useNavigate();

  const { orderId } = useParams();

  const [selectedReason, setSelectedReason] = useState("");

  const [customReason, setCustomReason] = useState("");

  const handleReject = async () => {
    try {
      await api.put(`/orders/${orderId}/status`, {
        status: "CANCELLED",
        cancelReason: customReason || selectedReason,
      });

      navigate("/restaurateur/orders?tab=completed");
    } catch (e) {
      console.error("Reject failed", e);
    }
  };
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

      <div className="reject-page">
        <h2>Reject Order</h2>
        <OrderCard order={order} tab="new" onAccept={() => {}} hideStatusButton />

        <div className="reject-box">
          <h3>Select a reason</h3>

          <div className="reject-list">
            {reasons.map((reason) => (
              <button
                key={reason}
                className={`reject-reason ${selectedReason === reason ? "active" : ""}`}
                onClick={() => setSelectedReason(reason)}
              >
                {reason}
              </button>
            ))}
          </div>

          <div className="reject-custom">
            <label>Another reason</label>

            <textarea
              placeholder="Enter text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          </div>
        </div>

        <AuthBtn className="reject-submit-btn" onClick={handleReject}>
          Reject
        </AuthBtn>
      </div>
    </>
  );
}
