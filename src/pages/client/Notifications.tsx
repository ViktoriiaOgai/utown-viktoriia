import NotificationList from "@/components/notifications/NotificationList";
import MobileHeader from "@/components/UI/Header";
import "@/pages/client/Notification.css";

export default function Notifications() {
  return (
    <>
      <MobileHeader logoVariant="gradient" showBack />
      <div className="notifications-page">
        <h1>Notifications</h1>
        <NotificationList />
      </div>
    </>
  );
}
