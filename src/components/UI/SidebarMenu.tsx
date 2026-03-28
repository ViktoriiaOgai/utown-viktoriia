import { Link } from "react-router-dom";
import "../../styles/mobile-menu.scss";

type SidebarMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  return (
    <>
      <div
        className={`mobile-menu-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`mobile-menu-drawer ${isOpen ? "open" : ""}`}>
        <div className="mobile-menu-topbar">
          <div className="mobile-menu-logo">UT.BUSINESS</div>
          <button
            type="button"
            className="mobile-menu-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-menu-list">
          <Link to="/admin/orders" className="mobile-menu-item" onClick={onClose}>
            <span>Order table</span>
            <span className="mobile-menu-arrow">›</span>
          </Link>

          <Link
            to="/admin/notifications"
            className="mobile-menu-item"
            onClick={onClose}
          >
            <span>Notifications</span>
            <span className="mobile-menu-arrow">›</span>
          </Link>

          <Link
            to="/admin/statistics"
            className="mobile-menu-item"
            onClick={onClose}
          >
            <span>Statistics</span>
            <span className="mobile-menu-arrow">›</span>
          </Link>

          <Link to="/admin/menu" className="mobile-menu-item" onClick={onClose}>
            <span>Menu</span>
            <span className="mobile-menu-arrow">›</span>
          </Link>

          <Link
            to="/admin/establishments"
            className="mobile-menu-item"
            onClick={onClose}
          >
            <span>Establishment</span>
            <span className="mobile-menu-arrow">›</span>
          </Link>

          <Link
            to="/admin/working-hours"
            className="mobile-menu-item"
            onClick={onClose}
          >
            <span>Working hours</span>
            <span className="mobile-menu-arrow">›</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}