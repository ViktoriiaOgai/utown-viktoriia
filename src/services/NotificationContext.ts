import { createContext } from "react";
import type { Notification } from "@/services/notifications";

type ContextType = {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  refetch: () => Promise<void>;
  unreadCount: number;
};

export const NotificationContext = createContext<ContextType | null>(null);
