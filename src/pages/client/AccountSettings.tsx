import {useState } from "react"; 
import "@/pages/client/AccountSettings.css";
import { useNavigate} from "react-router-dom";
import User from "@/assets/icons/user.svg";
import ArrowIcon from "@/assets/icons/Arrow.svg?react";
import ModalDelAcc from "@/components/UI/ModalDelAcc";
import { getUserData } from "@/hooks/auth";
import { Outlet } from "react-router-dom";
import MobileHeader from "@/components/UI/Header";

export default function AccountSettings() {
   const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);


  const user = getUserData();
const [firstName] = useState(user.fullName || "");

  


  return (
    <>
      <MobileHeader logoVariant="white" showBack backColor="white" showBell bellColor="white"/>
      {/* Основной контейнер */}
      <div className="mainAcc">
        <div className="mainCont-acc">
          <h1 className="H">Account Settings</h1>
        </div>
        
         <div className="InfoContainer">
           <img  src={user?.avatar || User}  onError={(e) => {
                   e.currentTarget.src = User;
            }}
                className="userimg"
                alt={firstName ? `${firstName} avatar` : "User avatar"}
              />
           <label className="user-name">{firstName ? ` ${firstName}` : ""}</label>
        </div>
                 <button className="prof-button" onClick={() => navigate("/profile/account/personalInf")}>
        <div className="profile-btn-acc">
           <h3 className="label">Edit Personal Information</h3>
           <ArrowIcon className="profile-icon" />
        </div>
      </button>
      <button className="prof-button" onClick={() => navigate("/profile/account/password")}>
        <div className="profile-btn-acc">
            <h3 className="label">Password</h3>
             <ArrowIcon className="profile-icon" />
        </div>
      </button>
      <button className="delAcc-button"onClick={() => setShowModal(true)}>
         <h3 className="dell-label">Delete account</h3>
      </button>
      {showModal && (<ModalDelAcc
                 title="Delete your account?"
                 message="This will permanently delete your account and all your data. 
                 This action cannot be undone. Enter your password to continue."
                 buttonText="Delete account"
                 onClose={() => setShowModal(false)}
     />
     )}
      <Outlet />
    </div>

  </>
  );
}