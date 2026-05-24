import type { Order } from "@/types/order";
import "./OrderTimeline.css";

type Props = {
  order: Order;
};

export function OrderTimeline({ order }: Props) {
  const cookingMinutes = order.cookingTime ?? 50;

  let readyTime = "--:--";

  if (order.time) {
    const [hours, minutes] = order.time.split(":").map(Number);

    if (!isNaN(hours) && !isNaN(minutes)) {
      const totalMinutes = hours * 60 + minutes + cookingMinutes;

      const readyHours = Math.floor(totalMinutes / 60) % 24;

      const readyMinutes = totalMinutes % 60;

      readyTime = `${String(readyHours).padStart(2, "0")}:${String(readyMinutes).padStart(2, "0")}`;
    }
  }

  return (
    <div className="timeline-box">
      <div className="timeline-left">
        <span className="timeline-time">{readyTime}</span>

        <div className="timeline-cooking">
          <span>Cooking time</span>

          <span>{cookingMinutes} min.</span>
        </div>
      </div>

      <button className="timeline-status">Courier collects order.</button>
    </div>
  );
}
