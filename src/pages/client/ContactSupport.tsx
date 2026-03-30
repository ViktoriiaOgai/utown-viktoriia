import "@/pages/client/ContactSupport.css";
import ArrowIcon from "@/assets/icons/Arrow.svg?react";
import MobileHeader from "@/components/UI/Header";

export default function ContactSupport() {
  return (
    <>
      <MobileHeader logoVariant="white" showBack backColor="white" showBell bellColor="white" />
      {/* Основной контейнер */}
      <div className="mainAcc-cont">
        <div className="mainCont-cont">
          <h1 className="H">Contact Support</h1>

          <button className="prof-button">
            <div className="profile-btn-acc">
              <h3 className="label">Message on Telegram</h3>
              <ArrowIcon className="profile-icon" />
            </div>
          </button>
          <button className="prof-button">
            <div className="profile-btn-acc">
              <h3 className="label">Call Mobile Phone</h3>
              <ArrowIcon className="profile-icon" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
