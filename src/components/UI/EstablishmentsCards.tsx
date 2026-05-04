import { useNavigate } from "react-router-dom";
import "@/components/UI/RestaurantCards.css";
import RestaurantCards from "@/components/UI/RestaurantCards";
type Props = {
  variant?: "scroll" | "grid";
  selectedCategory?: string | null;
};
export default function EstablishmentsCards({ selectedCategory }: Props) {
  const navigate = useNavigate();
  return (
    <RestaurantCards
      title="Establishments"
      variant="scroll"
      showMore
      selectedCategory={selectedCategory}
      onMoreClick={() => navigate("/establish")}
    />
  );
}
