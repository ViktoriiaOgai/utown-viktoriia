import LogoGradient from "@/assets/icons/Vector.svg?react";
import LogoWhite from "@/assets/icons/Vector-1.svg?react";
import BackButton from "./BackButton";
import BellIcon from "./BellIcon";
import "@/styles/Header.css";

type Props = {
  showBack?: boolean;
  bellColor?: string;
  logoVariant?: "gradient" | "white";
};

export default function MobileHeader({
  showBack = false,
  bellColor = "#9ca3af",
  logoVariant = "gradient",
}: Props) {
  return (
    <div className="header-icons">
      <div className="header-left">
        {showBack && <BackButton />}
      </div>

     <div className="header-center">
        {logoVariant === "white" ? (
          <LogoWhite className="logo-icon" />
        ) : (
          <LogoGradient className="logo-icon" />
        )}
      </div>

      <div className="header-right">
        <BellIcon color={bellColor} />
      </div>
    </div>
  );
}