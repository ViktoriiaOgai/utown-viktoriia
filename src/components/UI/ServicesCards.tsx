import { useNavigate} from "react-router-dom";
import reserve from "@/assets/icons/reserve.svg";
import mobileIcon from "@/assets/icons/mobile.svg";
import jobsIcon from "@/assets/icons/wallet-check.svg";
import servicesIcon from "@/assets/icons/keyboard.svg";

interface CardProps {
  title: string;
  icon: string;
  color: string;
  onClick?: () => void;
}

const Card = ({ title, icon, color, onClick }: CardProps) => {
  return (
    <div
      className="service-card"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      <img src={icon} alt={title} className="service-icon" />
      <h3>{title}</h3>
    </div>
  );
};

export default function ServicesCards() {
  const navigate = useNavigate();
  return (
    <div className="services-cards-container">
      <Card title="Food Delivery" icon={reserve} color="rgba(132, 117, 232, 1)" 
       onClick={() => navigate("/favourites")}/>
      <Card title="Mobile Connection" icon={mobileIcon} color="rgba(54, 214, 164, 1)" />
      <Card title="Jobs" icon={jobsIcon} color=" rgba(31, 188, 223, 1)" />
      <Card title="Services" icon={servicesIcon} color=" rgba(246, 166, 79, 1)" />
    </div>
  );
}