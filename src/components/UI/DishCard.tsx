import "@/components/UI/DishCard.css";
import Delete from "@/assets/icons/Delete button.svg?react";

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
  isConfirmDelete?: boolean;
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
  isConfirmDelete,
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

          <span>{quantity}</span>

          {isConfirmDelete ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            >
              <Delete className="del-icon" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onIncrease?.();
              }}
            >
              +
            </button>
          )}
        </div>
      )}
    </div>
  );
}
