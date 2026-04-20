import "@/components/UI/Modal.css";
import AuthBtn from "./AuthBtn";
import { useState } from "react";

type Dish = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
};

type Props = {
  dish: Dish;
  buttonText: string;
  onClose: () => void;
  onAddToCart: (dish: Dish, quantity: number) => void;
};

export default function DishModal({ dish, onClose, buttonText, onAddToCart }: Props) {
  const [count, setCount] = useState(1);

  const handleDecrease = () => {
    setCount((prev: number) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setCount((prev: number) => prev + 1);
  };

  const handleAdd = () => {
    onAddToCart(dish, count);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <img className="modal-image" src={dish.imageUrl || "/placeholder.jpg"} />

        <div className="modal-body">
          {/* крестик */}
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>

          <h2>{dish.title}</h2>
          <p>{dish.description}</p>

          <span className="price">{dish.price}won</span>

          {/* действия */}
          <div className="modal-actions">
            <div className="counter">
              <button onClick={handleDecrease}>-</button>
              <span>{count}</span>
              <button onClick={handleIncrease}>+</button>
            </div>

            <div className="modal-footer">
              <AuthBtn onClick={handleAdd} className="add-btn">
                {buttonText}
              </AuthBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
