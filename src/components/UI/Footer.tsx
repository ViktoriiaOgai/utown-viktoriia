import HomeIcon from "@/assets/icons/Home.svg?react";
import StarIcon from "@/assets/icons/Star.svg?react";
import ProfileIcon from "@/assets/icons/Profile.svg?react";
import { useNavigate, useLocation } from "react-router-dom";

import "@/components/UI/Footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  // фикс для notifications
  const getActivePath = () => {
    if (location.pathname === "/notifications") return "/home";
    return location.pathname;
  };

  const isActive = (path: string) => {
    return getActivePath().startsWith(path);
  };

  return (
    <div className="footer">
      <button
        className={isActive("/home") ? "icon-btn active" : "icon-btn"}
        onClick={() => navigate("/home")}
      >
        <div className="footer-btn">
          <HomeIcon className="footer-icon" />
          <h3 className="label">Home</h3>
        </div>
      </button>

      <button
        className={isActive("/favourites") ? "icon-btn active" : "icon-btn"}
        onClick={() => navigate("/favourites")}
      >
        <div className="footer-btn">
          <StarIcon className="footer-icon" />
          <h3 className="label">Favourites</h3>
        </div>
      </button>

      <button
        className={isActive("/profile") ? "icon-btn active" : "icon-btn"}
        onClick={() => navigate("/profile")}
      >
        <div className="footer-btn">
          <ProfileIcon className="footer-icon" />
          <h3 className="label">Profile</h3>
        </div>
      </button>
    </div>
  );
}
