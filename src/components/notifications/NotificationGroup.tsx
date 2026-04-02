import NotificationItem from "@/components/notifications/NotificationItem";
import "@/components/notifications/NotificationGroup.css";
import type { Notification } from "@/services/notifications";

type Props = {
  title: string;
  items: Notification[];
};

export default function NotificationGroup({ title, items }: Props) {
  if (!items.length) return null;

  return (
    <div>
      <p className="group-title">{title}</p>

      {items.map((item) => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </div>
  );
}
