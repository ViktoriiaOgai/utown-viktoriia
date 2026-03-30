import { useState } from "react";
import ServicesCards from "@/components/UI/ServicesCards";
import "@/pages/Profile.css";
import { useNavigate } from "react-router-dom";
import ProfileIcon from "@/assets/icons/profile-circle.svg?react";
import InformIcon from "@/assets/icons/setting-2.svg?react";
import FavouritesIcon from "@/assets/icons/star-prof.svg?react";
import SupportIcon from "@/assets/icons/sms-tracking.svg?react";
import LogOutIcon from "@/assets/icons/logout.svg?react";
import { logout } from "@/hooks/auth";
import { getUserData } from "@/hooks/auth";
import MobileHeader from "@/components/UI/Header";

export default function Profile() {
  const navigate = useNavigate();

  const [firstName] = useState(() => {
    const user = getUserData();
    return user.fullName || "";
  });
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {" "}
      {/* Основной контейнер */}
      <div className="mainCont">
        <MobileHeader logoVariant="white" showBell bellColor="white" />
        <div className="mainContInner">
          <h1 className="Hello">Hello{firstName ? `, ${firstName}` : ""}!</h1>
        </div>
        <ServicesCards />
        <div className="buttons-container">
          <button className="prof-button" onClick={() => navigate("/profile/account")}>
            <div className="profile-btn">
              <ProfileIcon className="profile-icon" />
              <h3 className="label">Account</h3>
            </div>
          </button>
          <button className="prof-button" onClick={() => navigate("/home")}>
            <div className="profile-btn">
              <InformIcon className="profile-icon" />
              <h3 className="label">Information</h3>
            </div>
          </button>
          <button className="prof-button" onClick={() => navigate("/home")}>
            <div className="profile-btn">
              <FavouritesIcon className="profile-icon" />
              <h3 className="label">Favourites</h3>
            </div>
          </button>
          <button className="prof-button" onClick={() => navigate("/home")}>
            <div className="profile-btn">
              <SupportIcon className="profile-icon" />
              <h3 className="label">Contact Support</h3>
            </div>
          </button>
          <button className="prof-button" onClick={handleLogout}>
            <div className="profile-btn">
              <LogOutIcon className="profile-icon-out" />
              <h3 className="label-out">LogOut</h3>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
