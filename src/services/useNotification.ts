import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error("NotificationProvider missing");
  }

  return ctx;
};
