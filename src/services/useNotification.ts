import { useOutletContext } from "react-router-dom";
import type { Notification } from "@/services/notifications";

export const useNotifications = () => {
  const { notifications } = useOutletContext<{ notifications: Notification[] }>();

  const unreadCount = notifications.filter((n) => !n.isSuccessful).length;

  return { notifications, unreadCount };
};
