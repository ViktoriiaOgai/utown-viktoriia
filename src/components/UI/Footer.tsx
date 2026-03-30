import HomeIcon from "@/assets/icons/Home.svg?react";
import StarIcon from "@/assets/icons/Star.svg?react";
import ProfileIcon from "@/assets/icons/Profile.svg?react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "@/components/UI/Footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isProfile = location.pathname.startsWith("/profile");
  return (
    <div className="footer">
      <button
        className={location.pathname === "/home" ? "icon-btn active" : "icon-btn"}
        onClick={() => navigate("/home")}
      >
        <div className="footer-btn">
          <HomeIcon className="footer-icon" />
          <h3 className="label">Home</h3>
        </div>
      </button>
      <button
        className={location.pathname === "/favourites" ? "icon-btn active" : "icon-btn"}
        onClick={() => navigate("/favourites")}
      >
        <div className="footer-btn">
          <StarIcon className="footer-icon" />
          <h3 className="label">Favourites</h3>
        </div>
      </button>
      <button
        className={isProfile ? "icon-btn active" : "icon-btn"}
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
