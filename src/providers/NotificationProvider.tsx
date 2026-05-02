import { useEffect, useState } from "react";
import { NotificationContext } from "@/services/NotificationContext";
import type { Notification } from "@/services/notifications";
import { fetchNotifications } from "@/services/notifications";
import { socket, connectSocket } from "@/services/socket";

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const load = async () => {
    const data = await fetchNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    const init = async () => {
      await load();
    };

    init();

    const token = localStorage.getItem("token");
    if (!token) return;

    if (!socket.connected) {
      connectSocket(token);
    }

    const handler = (data: Notification) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === data.id);
        if (exists) return prev;
        return [data, ...prev];
      });
    };

    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
      socket.disconnect();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isSuccessful).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        refetch: load,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
