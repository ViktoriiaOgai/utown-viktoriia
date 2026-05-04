import "@/pages/client/Information.css";
import ArrowIcon from "@/assets/icons/Arrow.svg?react";
import MobileHeader from "@/components/UI/Header";

export default function Information() {
  return (
    <>
      <MobileHeader logoVariant="white" showBack backColor="white" showBell bellColor="white" />
      {/* TODO: add navigation to each information page */}
      <div className="mainAcc-inf">
        <div className="mainCont-inf">
          <h1 className="H">Information</h1>
        </div>

        <button className="prof-button">
          <div className="profile-btn-acc">
            <h3 className="information__label ">Privacy Policy</h3>
            <ArrowIcon className="profile-icon" />
          </div>
        </button>
        <button className="prof-button">
          <div className="profile-btn-acc">
            <h3 className="information__label ">Term of Use</h3>
            <ArrowIcon className="profile-icon" />
          </div>
        </button>
        <button className="prof-button">
          <div className="profile-btn-acc">
            <h3
              className="information__label {
"
            >
              Disclaimer
            </h3>
            <ArrowIcon className="profile-icon" />
          </div>
        </button>
      </div>
    </>
  );
}
