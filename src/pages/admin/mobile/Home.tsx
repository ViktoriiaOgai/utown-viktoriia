import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./mobile.scss";

export default function AdminMobileHome() {
  const { setIsOpen } = useOutletContext<{ setIsOpen: (value: boolean) => void }>();
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Order table", path: "/admin-mobile/orders" },
    { label: "Statistics", path: "/admin-mobile/statistics" },
    { label: "Menu", path: "/admin-mobile/menu" },
    { label: "Establishment", path: "/admin-mobile/establishment" },
    { label: "Notifications", path: "/admin-mobile/notifications" },
    { label: "Working hours", path: "/admin-mobile/hours" },
  ];

  return (
    <div className="mobile-screen">
      <div className="mobile-header">
        <button className="mobile-menu" onClick={() => setIsOpen(true)}>
          ☰
        </button>
        <div className="mobile-brand">UT.BUSINESS</div>
      </div>

      <h2 className="mobile-title">Fast Chicken</h2>

      <div className="mobile-card">
        <div>
          <div className="mobile-card-title">Suspend operations</div>
          <div className="mobile-card-sub">Temporarily suspend the establishment's operations</div>
        </div>
        <input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
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
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
            <div key={day} className="mobile-day">
              <div className="mobile-day-title">{day}</div>
              <div className="mobile-day-time">{i === 1 ? "Day off" : "09:00 - 22:00"}</div>
            </div>
          ))}
        </div>
        <button className="mobile-action">Specify the establishment's working hours</button>
      </div>
    </div>
  );
}
