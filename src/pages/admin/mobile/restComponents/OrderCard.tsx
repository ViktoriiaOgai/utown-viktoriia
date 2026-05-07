import { Order } from "@/types/order";

type Props = {
  order: Order;
  tab: "new" | "completed";
  onAccept: (id: number) => void;
};

export function OrderCard({ order, onAccept }: Props) {
  const time = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="order-card">
      {/* HEADER */}
      <div className="order-header">
        <span className="order-number">Order No. {order.id}</span>
        <span className="order-time">{time}</span>
      </div>

      {/* ITEMS */}
      <ul className="order-items">
        {order.items?.map((item) => (
          <li key={item.id} className="order-item">
            <strong>
              {item.name} / x{item.quantity}
            </strong>

            {item.options?.length ? (
              <div className="order-sub">{item.options.join(", ")}</div>
            ) : null}
          </li>
        ))}
      </ul>

      {/* PRICE */}
      <div className="order-price">{order.totalSum.toLocaleString()} KRW</div>

      {/* ACTIONS */}
      <div className="order-actions">
        {order.status === "NEW" && (
          <button className="order-btn accept" onClick={() => onAccept(order.id)}>
            Accept
          </button>
        )}

        {order.status === "ACCEPTED" && (
          <button className="order-btn inprogress" disabled>
            In Progress
          </button>
        )}

        {order.status === "COMPLETED" && (
          <button className="order-btn completed" disabled>
            Completed
          </button>
        )}

        <button className="order-btn more">More Details</button>
      </div>
    </div>
  );
}
