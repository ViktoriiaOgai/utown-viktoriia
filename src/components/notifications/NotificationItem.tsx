import "@/components/notifications/NotificationItem.css";
import type { Notification } from "@/services/notifications";

type Props = {
  item: Notification;
};

export default function NotificationItem({ item }: Props) {
  return (
    <div className="notification-wrapper">
      <div className="notification-item">
        <div>{item.title}</div>
        <div>{item.text}</div>
      </div>

      <div className="time">{item.time}</div>
    </div>
  );
}
