import type { CartItem } from "@/types/cart";
import "@/pages/client/CartPage.css";
import MobileHeader from "@/components/UI/Header";
import { useNavigate } from "react-router-dom";
import DishCard from "@/components/UI/DishCard";
import { useCart } from "@/context/useCart";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();

  const getCount = (cart: CartItem[]) => cart.reduce((sum, item) => sum + item.quantity, 0);

  const getTotal = (cart: CartItem[]) =>
    cart.reduce(
      (sum, item) => sum + (item.dish.price + (item.option?.price ?? 0)) * item.quantity,
      0
    );

  const handleIncrease = (dishId: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.dish.id === dishId ? { ...item, quantity: quantity + 1 } : item))
    );
  };

  const handleDecrease = (dishId: number, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.dish.id === dishId ? { ...item, quantity: quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleDelete = (dishId: number) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  return (
    <div className="page-wrapper">
      <MobileHeader
        showBack
        backColor="white"
        logoVariant="white"
        showBell
        bellColor="white"
        title="Food"
      />
      <div className="main-container">
        <div className="cart-page">
          <h2>Your order</h2>

          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            cart.map((item) => (
              <DishCard
                key={item.dish.id}
                dish={item.dish}
                variant="cart"
                quantity={item.quantity}
                onIncrease={() => handleIncrease(item.dish.id, item.quantity)}
                onDecrease={() => handleDecrease(item.dish.id, item.quantity)}
                onDelete={() => handleDelete(item.dish.id)}
              />
            ))
          )}

          {cart.length > 0 && (
            <div className="view-order" onClick={() => navigate("/cart")}>
              <span className="left">
                <span className="badge-view">{getCount(cart)}</span>
                Proceed to payment
              </span>

              <span>{getTotal(cart)} won</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
