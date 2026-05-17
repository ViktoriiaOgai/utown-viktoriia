import React from "react";
import { Link } from "react-router-dom";
import "./MobileSidebar.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MobileSidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`mobile-sidebar-overlay ${isOpen ? "show" : ""}`} onClick={onClose} />

      <div className={`mobile-sidebar ${isOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-header">
          <span className="mobile-sidebar-logo">UT.BUSINESS</span>
          <button className="mobile-sidebar-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="mobile-sidebar-menu">
          <Link to="/restaurateur/orders" onClick={onClose}>
            <span>Order table</span>
            <span>›</span>
          </Link>

          <Link to="/restaurateur/notifications" onClick={onClose}>
            <span>Notifications</span>
            <span>›</span>
          </Link>

          <Link to="/restaurateur/statistics" onClick={onClose}>
            <span>Statistics</span>
            <span>›</span>
          </Link>

          <Link to="/restaurateur/menu" onClick={onClose}>
            <span>Menu</span>
            <span>›</span>
          </Link>

          <Link to="/restaurateur/establishment" onClick={onClose}>
            <span>Establishment</span>
            <span>›</span>
          </Link>

          <Link to="/restaurateur/hours" onClick={onClose}>
            <span>Working hours</span>
            <span>›</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;
