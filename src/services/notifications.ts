import { api } from "./api";

export type Notification = {
  id: number;
  title: string;
  text: string;
  date: string;
  time: string;
  isSuccessful: boolean;
  errorMessage?: string;
  userId: number;
};

export const fetchNotifications = async (page = 0, size = 10) => {
  const res = await api.get("/notifications/my-notifications", {
    params: {
      page,
      size,
    },
  });

  return res.data.content;
};

export const markAsRead = async (id: number) => {
  await api.patch(`/notifications/${id}/mark-successful`);
};
