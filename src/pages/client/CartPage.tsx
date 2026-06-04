import type { CartItem } from "@/types/cart";
import "@/pages/client/CartPage.css";
import "@/pages/client/EstablishPage.css";
import MobileHeader from "@/components/UI/Header";
import { useNavigate } from "react-router-dom";
import DishCard from "@/components/UI/DishCard";
import { useCart } from "@/context/useCart";
import { useState } from "react";
import axios from "axios";

import { checkoutCart, updateCartItem, removeFromCart } from "@/services/cartService";

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

  /* ================= INCREASE ================= */

  const handleIncrease = async (cartItemId: number, quantity: number) => {
    try {
      await updateCartItem(cartItemId, quantity + 1);

      setCart((prev) =>
        prev.map((item) =>
          item.dish.id === cartItemId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } catch (e) {
      console.error("Increase failed", e);
    }
  };

  /* ================= DECREASE ================= */

  const handleDecrease = async (cartItemId: number, quantity: number) => {
    if (quantity === 1) {
      setConfirmDeleteId(cartItemId);
      return;
    }

    try {
      await updateCartItem(cartItemId, quantity - 1);

      setCart((prev) =>
        prev.map((item) =>
          item.dish.id === cartItemId
            ? {
                ...item,
                quantity: quantity - 1,
              }
            : item
        )
      );
    } catch (e) {
      console.error("Decrease failed", e);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (cartItemId: number) => {
    try {
      await removeFromCart(cartItemId);

      setCart((prev) => prev.filter((item) => item.dish.id !== cartItemId));

      setConfirmDeleteId(null);
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  /* ================= CHECKOUT ================= */

  const handleCheckout = async () => {
    if (!cart.length) return;

    const restaurantId = cart[0]?.dish.restaurantId;

    if (!restaurantId) {
      console.error("No restaurantId");
      return;
    }

    const payload: Parameters<typeof checkoutCart>[0] = {
      restaurantId,

      fullAddress: "Seoul Gangnam 122",
      area: "Seoul",
      city: "Seoul",
      street: "Gangnam",

      details: "",
      clientPhone: "+821020203032",

      deliveryTime: "ASAP",
      payment: "CASH",

      latitude: 0,
      longitude: 0,

      postcode: "",
      state: "",

      typeAddress: 0,
      intercomCode: "",

      noteForCourier: "",
    };

    try {
      const order = await checkoutCart(payload);

      if (!order?.id) {
        console.error("Order id missing");
        return;
      }

      setCart([]);

      navigate(`/orders/${order.id}/payment`);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.log("STATUS:", e.response?.status);

        console.log("DATA:", e.response?.data);
      }

      console.error("FAILED checkoutCart:", e);
    }
  };
  console.log(cart);
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
                key={item.id}
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
