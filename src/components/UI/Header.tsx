import LogoGradient from "@/assets/icons/Vector.svg?react";
import LogoWhite from "@/assets/icons/Vector-1.svg?react";
import BackButton from "./BackButton";
import BellIcon from "./BellIcon";
import "@/components/UI/Header.css";
import { useNavigate } from "react-router-dom";

type Props = {
  showBack?: boolean;
  backColor?: string;
  showBell?: boolean;
  bellColor?: string;
  logoVariant?: "gradient" | "white" | "title";
  unreadCount?: number;
  title?: string;
};

export default function MobileHeader({
  showBack = false,
  showBell = false,
  backColor = "black",
  bellColor = "rgba(141, 141, 141, 1)",
  logoVariant = "gradient",
  unreadCount = 0,
  title = "",
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="header-icons">
      <div className="header-left">{showBack && <BackButton color={backColor} />}</div>

      <div className="header-center">
        <div className={`header-center-row ${logoVariant === "title" ? "with-title" : ""}`}>
          {logoVariant === "white" && <LogoWhite className="logo-icon" />}
          {logoVariant === "gradient" && <LogoGradient className="logo-icon" />}
          {logoVariant === "title" && (
            <>
              <LogoWhite className="logo-icon" />
              <div className="title-header">{title}</div>
            </>
          )}
          <div className="title-header">{title}</div>
        </div>
      </div>

      <div className="header-right">
        {showBell && (
          <div onClick={() => navigate("/notifications")}>
            <BellIcon count={unreadCount} color={bellColor} />
          </div>
        )}
      </div>
    </div>
  );
}
