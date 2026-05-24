import { Order } from "@/types/order";
import "@/pages/admin/mobile/restComponents/OrderCard.css";
import AuthBtn from "@/components/UI/AuthBtn";
import { useNavigate } from "react-router-dom";
import OrderNumTime from "@/pages/admin/mobile/restComponents/OrderNumTime";
import Tel from "@/assets/icons/Tel.svg";
import Location from "@/assets/icons/Location.svg";
import { useState } from "react";

type Props = {
  order: Order;
  tab: "new" | "completed";
  onAccept: (order: Order) => void;
  isDetails?: boolean;
  hideStatusButton?: boolean;
};

export function OrderCard({ order, onAccept, isDetails, hideStatusButton }: Props) {
  const navigate = useNavigate();

  const [activeClientButton, setActiveClientButton] = useState<"phone" | "location">("location");

  const [clientInfo, setClientInfo] = useState(order.fullAddress);

  const handlePhoneClick = () => {
    setActiveClientButton("phone");

    setClientInfo(order.clientPhone || "No phone number");
  };

  const handleLocationClick = () => {
    setActiveClientButton("location");

    setClientInfo(order.fullAddress || "No address");
  };

  /* ================= DETAILS PAGE ================= */

  if (isDetails) {
    return (
      <div className="order-details-card">
        {/* STATUS */}
        <div
          className={`details-status ${
            order.status === "PENDING"
              ? "pending"
              : order.status === "DELIVERED"
                ? "completed"
                : order.status === "CANCELLED"
                  ? "cancelled"
                  : "accepted"
          }`}
        >
          {order.status === "PENDING" && "Accept the order"}

          {(order.status === "CONFIRMED" ||
            order.status === "PREPARING" ||
            order.status === "READY") &&
            "Order accepted"}

          {order.status === "DELIVERED" && "Completed"}

          {order.status === "CANCELLED" && "Declined"}
        </div>

        {/* ITEMS */}
        <h3 className="details-section-title">Items</h3>

        <ul className="order-items">
          {!order.items?.length ? (
            <li className="order-empty">No items</li>
          ) : (
            order.items.map((item) => (
              <li key={item.id} className="order-item">
                <div className="order-item-row">
                  <strong>
                    {item.dishTitle} / x{item.count}
                  </strong>

                  <strong>{item.sum?.toLocaleString()}</strong>
                </div>

                {!!item.elements?.length && (
                  <div className="order-sub">{item.elements.join(", ")}</div>
                )}
              </li>
            ))
          )}
        </ul>

        {/* TOTAL */}
        <div className="details-total">
          <span>Total</span>

          <strong>{order.totalSum?.toLocaleString()} KRW</strong>
        </div>

        {/* PAYMENT */}
        <div className="payment-box">
          <span>{order.payment === "CARD" ? "Payment by card" : "Payment by transfer"}</span>

          <button className="paySumm">{order.totalSum?.toLocaleString()}</button>
        </div>

        {/* CLIENT */}
        <div className="client-box">
          <div className="client-header">
            <h3>Client</h3>

            <div className="client-actions">
              <button
                className={`client-circle-btn ${activeClientButton === "phone" ? "active" : ""}`}
                onClick={handlePhoneClick}
              >
                <img src={Tel} alt="tel" />
              </button>

              <button
                className={`client-circle-btn ${activeClientButton === "location" ? "active" : ""}`}
                onClick={handleLocationClick}
              >
                <img src={Location} alt="location" />
              </button>
            </div>
          </div>

          <p>{clientInfo}</p>
        </div>

        {/* ACTIONS */}
        <div className="details-actions">
          {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
            <button
              className="decline-btn"
              onClick={() => navigate(`/restaurateur/orders/${order.id}/reject`)}
            >
              Decline
            </button>
          )}

          {order.status === "PENDING" && (
            <AuthBtn className="accept-btn" onClick={() => onAccept(order)}>
              Accept the order
            </AuthBtn>
          )}

          {(order.status === "CONFIRMED" ||
            order.status === "PREPARING" ||
            order.status === "READY") && (
            <button className="accepted-btn" disabled>
              Order accepted
            </button>
          )}

          {order.status === "DELIVERED" && (
            <button className="accepted-btn completed" disabled>
              Completed
            </button>
          )}

          {order.status === "CANCELLED" && (
            <button className="accepted-btn cancelled" disabled>
              Declined
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ================= LIST CARD ================= */

  return (
    <div className="order-card">
      <OrderNumTime order={order} />

      {/* ITEMS */}
      <ul className="order-items">
        {!order.items?.length ? (
          <li className="order-empty">No items</li>
        ) : (
          order.items.map((item) => (
            <li key={item.id} className="order-item">
              <strong>
                {item.dishTitle} / x{item.count}
              </strong>

              {!!item.elements?.length && (
                <div className="order-sub">{item.elements.join(", ")}</div>
              )}
            </li>
          ))
        )}
      </ul>

      {/* PRICE */}
      <div className="order-price">{order.totalSum?.toLocaleString() ?? 0} KRW</div>

      {/* ACTIONS */}
      <div className="order-actions">
        {!hideStatusButton && (
          <>
            {/* PENDING */}
            {order.status === "PENDING" && (
              <AuthBtn className="order-btn accept" onClick={() => onAccept(order)}>
                Accept
              </AuthBtn>
            )}

            {/* CONFIRMED */}
            {order.status === "CONFIRMED" && (
              <AuthBtn className="order-btn-inprogress" disabled>
                Accepted
              </AuthBtn>
            )}

            {/* PREPARING */}
            {order.status === "PREPARING" && (
              <AuthBtn className="order-btn-inprogress" disabled>
                Preparing
              </AuthBtn>
            )}

            {/* DELIVERED */}
            {order.status === "DELIVERED" && (
              <AuthBtn className="order-btn-completed" disabled>
                Completed
              </AuthBtn>
            )}

            {/* CANCELLED */}
            {order.status === "CANCELLED" && (
              <AuthBtn className="order-btn-declined" disabled>
                Rejected
              </AuthBtn>
            )}
          </>
        )}

        {!isDetails && (
          <AuthBtn
            className="order-btn-more"
            onClick={() =>
              navigate(
                order.status === "CANCELLED"
                  ? `/restaurateur/orders/${order.id}/reject`
                  : `/restaurateur/orders/${order.id}/details`
              )
            }
          >
            More Details
          </AuthBtn>
        )}
      </div>
    </div>
  );
}
