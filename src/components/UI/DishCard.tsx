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

  variant?: "default" | "cart";

  // cart mode
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onDelete?: () => void;
};

export default function DishCard({
  dish,
  onClick,
  variant = "default",
  quantity,
  onIncrease,
  onDecrease,
  onDelete,
}: Props) {
  return (
    <div className="dish-card" onClick={onClick}>
      <img src={dish.imageUrl || "/placeholder.jpg"} alt={dish.title} />

      <div>
        <h4>{dish.title}</h4>
        <p>{dish.description}</p>
        <span>{dish.price} won</span>
      </div>

      {/* CART MODE */}
      {variant === "cart" && (
        <div className="cart-controls">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDecrease?.();
            }}
          >
            -
          </button>

          <span>{quantity ?? 0}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onIncrease?.();
            }}
          >
            +
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}
