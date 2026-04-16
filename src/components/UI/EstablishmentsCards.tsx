import { useNavigate } from "react-router-dom";
import "@/components/UI/RestaurantCards.css";
import RestaurantCards from "@/components/UI/RestaurantCards";

export default function EstablishmentsCards() {
  const navigate = useNavigate();
  return (
    <RestaurantCards
      title="Establishments"
      variant="scroll"
      showMore
      onMoreClick={() => navigate("/establish")}
    />
  );
}
