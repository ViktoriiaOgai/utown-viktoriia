import LogoGradient from "@/assets/icons/Vector.svg?react";
import LogoWhite from "@/assets/icons/Vector-1.svg?react";
import BackButton from "./BackButton";
import BellIcon from "./BellIcon";
import "@/components/UI/Header.css";

type Props = {
  showBack?: boolean;
  backColor?: string;
  showBell?: boolean;
  bellColor?: string;
  logoVariant?: "gradient" | "white";
};

export default function MobileHeader({
  showBack = false,
  showBell = false,
  backColor = "black",
  bellColor = "#9ca3af",
  logoVariant = "gradient",
}: Props) {
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

      <div className="header-right">{showBell && <BellIcon color={bellColor} />}</div>
    </div>
  );
}
