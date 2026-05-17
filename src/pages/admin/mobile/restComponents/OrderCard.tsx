import { Order } from "@/types/order";
import "@/pages/admin/mobile/restComponents/OrderCard.css";
import AuthBtn from "@/components/UI/AuthBtn";

type Props = {
  order: Order;
  tab: "new" | "completed";
  onAccept: (order: Order) => void;
};

export function OrderCard({ order, onAccept }: Props) {
  const timeSource = order.date || order.time;

  const time = timeSource
    ? new Date(timeSource).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="order-card">
      <div className="order-header">
        <span className="order-number">Order No. {order.number}</span>

        <span className="order-time">{time}</span>
      </div>

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
        {/* PENDING */}
        {order.status === "PENDING" && (
          <AuthBtn className="order-btn accept" onClick={() => onAccept(order)}>
            Accept
          </AuthBtn>
        )}

        {/* CONFIRMED / PREPARING */}
        {order.status === "PREPARING" && (
          <button className="order-btn inprogress" disabled>
            Preparing
          </button>
        )}

        {order.status === "CONFIRMED" && (
          <button className="order-btn inprogress" disabled>
            Accepted
          </button>
        )}
        {/* DELIVERED */}
        {order.status === "DELIVERED" && (
          <button className="order-btn completed" disabled>
            Completed
          </button>
        )}

        {/* CANCELLED */}
        {order.status === "CANCELLED" && (
          <button className="order-btn declined" disabled>
            Declined
          </button>
        )}

        <AuthBtn className="order-btn more">More Details</AuthBtn>
      </div>
    </div>
  );
}
