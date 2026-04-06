import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { markAsRead } from "@/services/notifications";
import { socket, connectSocket } from "@/services/socket";
import NotificationGroup from "@/components/notifications/NotificationGroup";
import type { Notification } from "@/services/notifications";
import "@/components/notifications/NotificationList.css";

type ContextType = {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export default function NotificationList() {
  const { notifications, setNotifications } = useOutletContext<ContextType>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token);
    }

    const handleSocket = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on("notification", handleSocket);

    return () => {
      socket.off("notification", handleSocket);
    };
  }, [setNotifications]);

  useEffect(() => {
    if (notifications.length === 0) return;

    notifications.forEach((n) => {
      if (!n.isSuccessful) {
        markAsRead(n.id);
      }
    });
  }, [notifications]);

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
