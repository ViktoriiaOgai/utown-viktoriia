import "@/components/UI/Modal.css";
import AuthBtn from "@/components/UI/AuthBtn";
import { useState } from "react";
import type { Dish, DishOption, CartItem } from "@/types/cart";

type Props = {
  dish: Dish;
  buttonText: string;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
};

export default function DishModal({ dish, onClose, buttonText, onAddToCart }: Props) {
  const [quantity, setQuantity] = useState(1);
  const OPTIONS: DishOption[] = [
    { id: "none", label: "No options", price: 0 },
    { id: "large", label: "Large portion", price: 1000 },
    { id: "small", label: "Small portion", price: 500 },
  ];
  const [selectedOption, setSelectedOption] = useState<DishOption>(OPTIONS[0]);

  const totalPrice = (dish.price + (selectedOption?.price ?? 0)) * quantity;

  const handleAdd = () => {
    onAddToCart({
      dish,
      quantity,
      option: selectedOption,
    });
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
          <span className="price">{dish.price} won</span>
          <p>{dish.description}</p>
          {OPTIONS.map((opt) => (
            <div
              key={opt.id}
              className={`option ${selectedOption?.id === opt.id ? "active" : ""}`}
              onClick={() => setSelectedOption(opt)}
            >
              <div className="radio" />
              <span>{opt.label}</span>
              <span>+ {opt.price} won</span>
            </div>
          ))}

          {/* действия */}
          <div className="modal-actions">
            <div className="counter">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>

            <div className="modal-footer">
              <AuthBtn onClick={handleAdd} className="add-btn">
                {buttonText} • {totalPrice} won
              </AuthBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
