import { useState, useEffect } from "react";
import MobileHeader from "@/components/UI/Header";
import { useNotifications } from "@/services/useNotification";
import "@/styles/layout.css";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import Deliver from "@/assets/icons/deliver.svg?react";
import Danger from "@/assets/icons/danger.svg?react";
import Bank from "@/assets/icons/Bank icon.svg?react";
import AuthBtn from "@/components/UI/AuthBtn";
import "@/pages/client/OrderPaymentPage.css";
import AddressDropdown from "@/components/UI/AddressDropdown";
import Spinner from "@/components/UI/Spinner";
import { Orders } from "@/types/restaurant";

type Address = {
  id: number;
  fullAddress: string;
};

export default function OrderPaymentPage() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { id } = useParams();

  const [order, setOrder] = useState<Orders | null>(null);

  //  новое
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!id) return;

    api.get<Orders>(`/orders/${id}`).then((res) => {
      const data = res.data;
      setOrder(data);

      setNote(data.noteForCourier || "");

      if (data.addresses) {
        setAddresses(data.addresses);
        setSelectedAddressId(data.addresses[0]?.id || null);
      } else {
        setAddresses([{ id: 1, fullAddress: data.fullAddress || "" }]);
        setSelectedAddressId(1);
      }
    });
  }, [id]);

  const [payStatus, setPayStatus] = useState<"idle" | "loading" | "processing">("idle");
  const [orderStatus] = useState<string | null>(null);
  const handlePay = async () => {
    if (!id) return;

    try {
      setPayStatus("loading");

      await api.post(`/orders/${id}/pay`, null, {
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
      });

      //  переход вместо polling
      navigate(`/order/${id}/status`);
    } catch (e) {
      console.error(e);
      setPayStatus("idle");
    }
  };

  if (payStatus === "processing") {
    const statusMap: Record<string, string> = {
      PENDING: "Order confirming by the restaurant",
      CONFIRMED: "Order confirmed",
      PREPARING: "Restaurant is preparing your order",
      READY: "Order is ready",
      OUT_FOR_DELIVERY: "Courier is on the way",
      DELIVERED: "Order delivered",
      CANCELLED: "Order cancelled",
    };

    return (
      <div className="status-screen">
        <h2>{order?.deliveryTime || "50-60"}</h2>
        <p>minutes</p>

        <h3>{statusMap[orderStatus || "PENDING"]}</h3>

        <AuthBtn>Hide Order Status</AuthBtn>
      </div>
    );
  }

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

      <div className="main-container">
        <div className="main-inner">
          <h1>Order Payment</h1>

          {/* RESTAURANT */}
          <div className="field">
            <div className="value bold">{order?.restaurantName}</div>
          </div>

          {/* DELIVERY TIME */}
          <div className="field-box">
            <Deliver />

            <div className="field-content">
              <div className="title">Delivery</div>
              <div className="value">
                Delivery in {order?.deliveryTime || order?.time || "ASAP"}
              </div>
            </div>
          </div>

          {/* ADDRESS (SELECT) */}
          <AddressDropdown
            addresses={addresses}
            selectedId={selectedAddressId}
            onChange={setSelectedAddressId}
          />

          {/* NOTE (INPUT) */}
          <div className="field-box">
            <Danger />

            <div className="field-content">
              <div className="title">Note for the courier</div>

              <textarea
                className="value textarea"
                placeholder="Leave at the door"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* PAYMENT */}
          <h2>Payment</h2>

          <div className="field clickable">
            <div className="label">
              <Bank /> Payment
            </div>
            <div className="value-box">CARD</div>
          </div>

          {/* TOTAL */}
          <h2>Total (won)</h2>

          <div className="summary">
            <div className="row">
              <span>Order Amount</span>
              <span>{order?.orderPrice}</span>
            </div>

            <div className="row">
              <span>Delivery</span>
              <span>{order?.deliveryPrice}</span>
            </div>

            <div className="row total">
              <span>Total</span>
              <span>{order?.totalSum}</span>
            </div>
          </div>
        </div>

        {/* FIXED PAY BAR */}
        <div className="pay-container">
          <div className="pay-total">{order?.totalSum} ₩</div>

          <AuthBtn onClick={handlePay}>Pay</AuthBtn>
        </div>
      </div>
      {payStatus === "loading" && <Spinner />}
    </div>
  );
}
