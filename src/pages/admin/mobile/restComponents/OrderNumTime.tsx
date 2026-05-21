import { Order } from "@/types/order";
import "@/pages/admin/mobile/restComponents/OrderNumTime.css";
import { formatTime } from "@/utils/formatTime";

type Props = {
  order: Order;
  variant?: "default" | "details";
  hideOrderNumber?: boolean;
};

export default function OrderNumTime({
  order,
  variant = "default",
  hideOrderNumber = false,
}: Props) {
  return (
    <div className={variant === "details" ? "order-header order-header--details" : "order-header"}>
      {!hideOrderNumber && (
        <span
          className={variant === "details" ? "order-number order-number--details" : "order-number"}
        >
          Order No. {order.number}
        </span>
      )}

      <span className="order-time">{formatTime(order.time)}</span>
    </div>
  );
}
