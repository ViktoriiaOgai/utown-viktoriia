import { useNavigate } from "react-router-dom";
import BackIcon from "@/assets/icons/Back.svg?react";
import "@/components/UI/BackButton.css";

type Props = {
  className?: string;
  color?: string;
  size?: number;
};

export default function BackButton({ className = "", color = "black", size = 32 }: Props) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
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
