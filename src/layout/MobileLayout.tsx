import Footer from "@/components/UI/Footer";
import { Outlet } from "react-router-dom";
import "@/layout/MobileLayout.css";
import type { Notification } from "@/services/notifications";
import { useEffect, useState } from "react";
import { fetchNotifications } from "@/services/notifications";

export default function MobileLayout() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications().then((data) => {
      console.log("FETCHED:", data);
      setNotifications(data);
    });
  }, []);

  return (
    <div className="mobile-layout">
      <main className="mobile-content">
        <Outlet context={{ notifications, setNotifications }} />
      </main>
      <Footer />
    </div>
  );
}
