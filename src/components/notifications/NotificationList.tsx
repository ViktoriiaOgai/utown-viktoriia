import { useEffect, useState } from "react";
import { fetchNotifications } from "@/services/notifications";
import { socket, connectSocket } from "@/services/socket";
import NotificationGroup from "@/components/notifications/NotificationGroup";
import type { Notification } from "@/services/notifications";
import "@/components/notifications/NotificationList.css";
import { markAsRead } from "@/services/notifications";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();

      if (notifications.length === 0) {
        return <div className="empty">No notifications yet</div>;
      }
      setNotifications(data);
      await Promise.all(data.filter((n) => !n.isSuccessful).map((n) => markAsRead(n.id)));
    };

    loadNotifications();

    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token);
    }

    socket.on("notification", (data: Notification) => {
      console.log("SOCKET:", data);
      markAsRead(data.id);
      setNotifications((prev) => [{ ...data, isSuccessful: true }, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const isToday = (dateStr: string): boolean => {
    const today = new Date();
    const date = new Date(dateStr);

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todayItems = notifications.filter((n) => isToday(n.date));
  const otherItems = notifications.filter((n) => !isToday(n.date));
  if (notifications.length === 0) {
    return <div className="empty">No notifications yet</div>;
  }
  return (
    <div>
      {otherItems.length > 0 && <NotificationGroup title="Yesterday" items={otherItems} />}

      {todayItems.length > 0 && <NotificationGroup title="Today" items={todayItems} />}
    </div>
  );
}
