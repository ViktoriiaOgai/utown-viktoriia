import NotificationItem from "@/components/notifications/NotificationItem";
import "@/components/notifications/NotificationGroup.css";
import type { Notification } from "@/services/notifications";

type Props = {
  title: string;
  items: Notification[];
  onRead?: (id: number) => void;
};

export default function NotificationGroup({ title, items, onRead }: Props) {
  if (!items.length) return null;

  return (
    <div>
      <p className="group-title">{title}</p>

      {items.map((item) => (
        <NotificationItem key={item.id} item={item} onRead={onRead} />
      ))}
    </div>
  );
}
