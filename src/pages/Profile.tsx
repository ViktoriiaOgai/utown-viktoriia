import { useEffect, useState } from "react"; 
import ServicesCards from "@/components/UI/ServicesCards";
import "@/styles/Profile.css";
import MobileHeader from "@/components/UI/Header";
import { useNavigate} from "react-router-dom";
import ProfileIcon from "@/assets/icons/profile-circle.svg?react";
import InformIcon from "@/assets/icons/setting-2.svg?react";
import FavouritesIcon from "@/assets/icons/star-prof.svg?react";
import SupportIcon from "@/assets/icons/sms-tracking.svg?react";
import LogOutIcon from "@/assets/icons/logout.svg?react";

export default function Profile() {
   const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
     const name = localStorage.getItem("fullName");

    if (name) {
       // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstName(name);
    }
    
  }, []);

  return (
    <div className="profile">
     <MobileHeader logoVariant="white" bellColor= "white" />

      {/* Основной контейнер */}
      <div className="mainCont">
        <div className="mainContInner">
          <h1 className="Hello">Hello{firstName ? `, ${firstName}` : ""}!</h1>
        </div>
          <ServicesCards />
           <div className="buttons-container">
      <button className="prof-button" onClick={() => navigate("/home")}>
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
      <button className="prof-button" onClick={() => navigate("/home")}>
        <div className="profile-btn">
          <LogOutIcon className="profile-icon-out" />
          <h3 className="label-out">LogOut</h3>
        </div>
      </button>
    </div>

  </div>
</div>
  );
}