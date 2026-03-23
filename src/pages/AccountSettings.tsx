import {useState } from "react"; 
import "@/pages/AccountSettings.css";
import { useNavigate} from "react-router-dom";
import User from "@/assets/icons/user.svg";
import ArrowIcon from "@/assets/icons/Arrow.svg?react";
import { logout } from "@/hooks/auth";
import { getUserData } from "@/hooks/auth";
import { Outlet } from "react-router-dom";
import MobileHeader from "@/components/UI/Header";

export default function AccountSettings() {
   const navigate = useNavigate();
  

  const user = getUserData();
const [firstName] = useState(user.fullName || "");

    const handleLogout = () => {
  logout();
navigate("/login");
};


  return (
    <>
      <MobileHeader logoVariant="white" showBack backColor="white" showBell bellColor="white"/>
      {/* Основной контейнер */}
      <div className="mainAcc">
        <div className="mainCont-acc">
          <h1 className="H">Account Settings</h1>
        </div>
         <div className="OrderInfoContainer">
           <img src={User} className="userimg"/>
           <label className="user-name">{firstName ? ` ${firstName}` : ""}</label>
        </div>
                 <button className="prof-button" onClick={() => navigate("/profile/account/personalInf")}>
        <div className="profile-btn-acc">
           <h3 className="label">Edit Personal Information</h3>
           <ArrowIcon className="profile-icon" />
        </div>
      </button>
      <button className="prof-button" onClick={() => navigate("/home")}>
        <div className="profile-btn-acc">
            <h3 className="label">Password</h3>
             <ArrowIcon className="profile-icon" />
        </div>
      </button>
      <button className="delAcc-button" onClick={handleLogout}>
        <div className="profile-btn-acc">
          <h3 className="label-out">Delete account</h3>
        </div>
      </button>
      <Outlet />
    </div>

  </>
  );
}