import type { CartItem } from "@/types/cart";
import "@/pages/client/CartPage.css";
import "@/pages/client/EstablishPage.css";
import MobileHeader from "@/components/UI/Header";
import { useNavigate } from "react-router-dom";
import DishCard from "@/components/UI/DishCard";
import { useCart } from "@/context/useCart";
import { useState } from "react";
import { createOrder } from "@/services/createOrder";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
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
    if (quantity === 1) {
      setConfirmDeleteId(dishId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.dish.id === dishId ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const handleDelete = (dishId: number) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
    setConfirmDeleteId(null);
  };

  const handleCheckout = async () => {
    console.log("checkout clicked");

    if (!cart.length) return;

    const restaurantId = cart[0]?.dish.restaurantId;

    if (!restaurantId) {
      console.error("No restaurantId");
      return;
    }

    const payload = {
      fullAddress: "Seoul Gangnam 122",
      area: "Seoul",
      city: "Seoul",
      street: "Gangnam",
      details: "",
      clientPhone: "01020203032",
      deliveryTime: "ASAP",
      cookingTime: 0,
      orderPrice: getTotal(cart),
      deliveryPrice: 0,
      totalSum: getTotal(cart),
      payment: "CARD",
      noteForCourier: "",
      restaurantId,
      latitude: 0,
      longitude: 0,
      postcode: "",
      state: "",
      typeAddress: 0,
      intercomCode: "",
    };

    try {
      const order = await createOrder(payload);

      console.log("order response:", order);

      navigate(`/orders/${order.id}/payment`);
    } catch (e) {
      console.error("FAILED createOrder:", e);
    }
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
                isConfirmDelete={confirmDeleteId === item.dish.id}
              />
            ))
          )}

          {cart.length > 0 && (
            <div className="view-order" onClick={handleCheckout}>
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
