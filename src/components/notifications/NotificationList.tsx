import { markAsRead } from "@/services/notifications";
import NotificationGroup from "@/components/notifications/NotificationGroup";
import "@/components/notifications/NotificationList.css";
import { useNotifications } from "@/services/useNotification";

export default function NotificationList() {
  const { notifications, setNotifications } = useNotifications();

  const isToday = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleRead = async (id: number) => {
    await markAsRead(id);

    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isSuccessful: true } : n)));
  };

  const todayItems = notifications.filter((n) => isToday(n.date));
  const otherItems = notifications.filter((n) => !isToday(n.date));

  if (notifications.length === 0) {
    return <div className="empty">No notifications yet</div>;
  }

  return (
    <div>
      {otherItems.length > 0 && (
        <NotificationGroup title="Yesterday" items={otherItems} onRead={handleRead} />
      )}

      {todayItems.length > 0 && (
        <NotificationGroup title="Today" items={todayItems} onRead={handleRead} />
      )}
    </div>
  );
}
