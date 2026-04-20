import "@/components/UI/DishCard.css";

type Dish = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
};

type Props = {
  dish: Dish;
  onClick?: () => void;
};

export default function DishCard({ dish, onClick }: Props) {
  return (
    <div className="dish-card" onClick={onClick}>
      <img src={dish.imageUrl || "/placeholder.jpg"} />

      <div>
        <h4>{dish.title}</h4>
        <p>{dish.description}</p>
        <span>{dish.price}won</span>
      </div>
    </div>
  );
}
