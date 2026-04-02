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
  logoVariant?: "gradient" | "white";
  unreadCount?: number;
};

export default function MobileHeader({
  showBack = false,
  showBell = false,
  backColor = "black",
  bellColor = "rgba(141, 141, 141, 1)",
  logoVariant = "gradient",
  unreadCount = 0,
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="header-icons">
      <div className="header-left">{showBack && <BackButton color={backColor} />}</div>

      <div className="header-center">
        {logoVariant === "white" ? (
          <LogoWhite className="logo-icon" />
        ) : (
          <LogoGradient className="logo-icon" />
        )}
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
