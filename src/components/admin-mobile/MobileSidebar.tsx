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
      <div className={`overlay ${isOpen ? "show" : ""}`} onClick={onClose} />

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="logo">UT.BUSINESS</span>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="menu">
          <Link to="/admin/orders" onClick={onClose}>
            <span>Order table</span>
            <span>›</span>
          </Link>

          <Link to="/admin/notifications" onClick={onClose}>
            <span>Notifications</span>
            <span>›</span>
          </Link>

          <Link to="/admin/statistics" onClick={onClose}>
            <span>Statistics</span>
            <span>›</span>
          </Link>

          <Link to="/admin/menu" onClick={onClose}>
            <span>Menu</span>
            <span>›</span>
          </Link>

          <Link to="/admin/establishments" onClick={onClose}>
            <span>Establishment</span>
            <span>›</span>
          </Link>

          <Link to="/admin/hours" onClick={onClose}>
            <span>Working hours</span>
            <span>›</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;
