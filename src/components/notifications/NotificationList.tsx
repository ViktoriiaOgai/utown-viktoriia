import { useEffect, useState } from "react";
import { fetchNotifications } from "@/services/notifications";
import { socket, connectSocket } from "@/services/socket";
import NotificationGroup from "@/components/notifications/NotificationGroup";
import type { Notification } from "@/services/notifications";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications().then(setNotifications);

    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token);
    }

    socket.on("notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
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

  return (
    <div>
      <NotificationGroup title="Yesterday" items={otherItems} />
      <NotificationGroup title="Today" items={todayItems} />
    </div>
  );
}
