import { useNavigate, useLocation } from "react-router-dom";
import BackIcon from "@/assets/icons/Back.svg?react";
import "@/components/UI/BackButton.css";

type Props = {
  className?: string;
  color?: string;
  size?: number;
};

export default function BackButton({
  className = "",
  color = "black",
  size = 32,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleBack = () => {
  if (location.state?.from) {
    navigate(location.state.from);
  } else {
    navigate(-1);
  }
};

  return (
    <button className={`back-btn ${className}`} onClick={handleBack}>
      <BackIcon
        style={{
          color: color,
          width: size,
          height: size,
        }}
      />
    </button>
  );
}