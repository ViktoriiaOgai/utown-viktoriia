import { useNavigate } from "react-router-dom";
import Back from "@/assets/icons/Back.svg";

type Props = {
  className?: string;
};

export default function BackButton({ className }: Props) {
  const navigate = useNavigate();

  return (
    <button
      className={`back-btn ${className || ""}`}
      onClick={() => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate("/");
  }
}}
    >
     <img src={Back} alt="Back" className="Back_icon" /> 
    </button>
  );
}