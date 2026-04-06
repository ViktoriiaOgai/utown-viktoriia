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
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <nav>
          <Link to="/admin/orders" onClick={onClose}>
            Order table
          </Link>
          <Link to="/admin/notifications" onClick={onClose}>
            Notifications
          </Link>
          <Link to="/admin/statistics" onClick={onClose}>
            Statistics
          </Link>
          <Link to="/admin/menu" onClick={onClose}>
            Menu
          </Link>
          <Link to="/admin/establishments" onClick={onClose}>
            Establishment
          </Link>
          <Link to="/admin/hours" onClick={onClose}>
            Working hours
          </Link>
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;
