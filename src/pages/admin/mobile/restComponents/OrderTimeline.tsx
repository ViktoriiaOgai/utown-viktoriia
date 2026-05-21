import type { Order } from "@/types/order";
import OrderNumTime from "./OrderNumTime";

type Props = {
  order: Order;
};

export function OrderTimeline({ order }: Props) {
  const cookingFinishTime = order.time
    ? new Date(
        new Date(order.time).getTime() + (order.cookingTime ?? 0) * 60000
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="order-timeline">
      <div className="order-timeline-row">
        <span>
          <OrderNumTime order={order} hideOrderNumber />
        </span>
      </div>

      <div className="order-timeline-row">
        <span>Cooking time</span>
        <span>{order.cookingTime ?? 0} min</span>
      </div>

      <div className="order-timeline-row">
        <span>Ready at</span>
        <span>{cookingFinishTime}</span>
      </div>
    </div>
  );
}
