import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getMyRestaurant } from "@/services/workingHoursService";
import { api } from "@/services/api";
import "./mobile.scss";

type Restaurant = {
  id: number;
  title: string;
  enabled: boolean;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RestaurateurHome() {
  const { setIsOpen } = useOutletContext<{ setIsOpen: (value: boolean) => void }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const navItems = [
    { label: "Order table", path: "/restaurateur/orders" },
    { label: "Statistics", path: "/restaurateur/statistics" },
    { label: "Menu", path: "/restaurateur/menu" },
    { label: "Establishment", path: "/restaurateur/establishment" },
    { label: "Notifications", path: "/restaurateur/notifications" },
    { label: "Working hours", path: "/restaurateur/hours" },
  ];

  useEffect(() => {
    getMyRestaurant().then(setRestaurant);
  }, []);

  const handleToggleStatus = async () => {
    if (!restaurant) return;
    await api.patch(`/restaurant-owner/restaurants/${restaurant.id}/toggle-status`);
    setRestaurant((prev) => (prev ? { ...prev, enabled: !prev.enabled } : prev));
  };

  return (
    <div className="mobile-screen">
      <div className="mobile-header">
        <button className="mobile-menu" onClick={() => setIsOpen(true)}>
          ☰
        </button>
        <div className="mobile-brand">UT.BUSINESS</div>
      </div>

      <h2 className="mobile-title">{restaurant?.title ?? "..."}</h2>

      <div className="mobile-card">
        <div>
          <div className="mobile-card-title">Suspend operations</div>
          <div className="mobile-card-sub">Temporarily suspend the establishment's operations</div>
        </div>
        <input
          type="checkbox"
          checked={restaurant?.enabled ?? false}
          onChange={handleToggleStatus}
        />
      </div>

      <div className="mobile-section">
        <div className="mobile-section-title">Navigation</div>
        <div className="mobile-grid">
          {navItems.map((item) => (
            <button key={item.label} className="mobile-btn" onClick={() => navigate(item.path)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mobile-section">
        <div className="mobile-section-title">Working hours</div>
        <div className="mobile-hours">
          {DAYS.map((day) => (
            <div key={day} className="mobile-day">
              <div className="mobile-day-title">{day}</div>
              <div className="mobile-day-time">—</div>
            </div>
          ))}
        </div>
        <button className="mobile-action" onClick={() => navigate("/restaurateur/hours")}>
          Specify the establishment's working hours
        </button>
      </div>
    </div>
  );
}
