import EstablishmentHeader from "@/components/UI/EstablishmentHeader";
import CategoryTabs from "@/components/UI/CategoryTabs";
import MenuSection from "@/components/UI/MenuSection";
import MobileHeader from "@/components/UI/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import "@/pages/client/EstablishmentPage.css";
import Search from "@/components/UI/Search";
import Icon from "@/assets/icons/search-normal.svg";
import type { CartItem, Dish } from "@/types/cart";
import DishModal from "@/components/UI/DishModal";
import { useCart } from "@/context/useCart";

type Restaurant = {
  id: number;
  title: string;
  description: string;
  logoUrl?: string;
  imageUrl?: string;
  category: string;
  minOrderAmount: number;
  deliveryTime: string;
};

export default function EstablishmentPage() {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    api.get(`/public/restaurants/${id}`).then((res) => {
      setRestaurant(res.data);
    });
  }, [id]);

  //  расчёты
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.dish.price + (item.option?.price ?? 0)) * item.quantity,
    0
  );

  // универсальная функция добавления
  const addToCartLocal = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.dish.id === item.dish.id && (i.option?.id ?? null) === (item.option?.id ?? null)
      );

      if (existing) {
        return prev.map((i) =>
          i.dish.id === item.dish.id && (i.option?.id ?? null) === (item.option?.id ?? null)
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [
        ...prev,
        {
          dish: { ...item.dish }, //  копия
          option: item.option,
          quantity: item.quantity,
        },
      ];
    });
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
        {restaurant && <EstablishmentHeader restaurant={restaurant} />}

        <Search
          value={search}
          placeholder="Search dishes or categories"
          onChange={(e) => setSearch(e.target.value)}
          disableNavigation
          icon={Icon}
        />

        {restaurant && (
          <CategoryTabs
            restaurantId={restaurant.id}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {restaurant && (
          <MenuSection
            restaurantId={restaurant.id}
            search={search}
            selectedCategory={selectedCategory}
            onSelectDish={setSelectedDish}
            onAddToCart={addToCartLocal}
          />
        )}

        {selectedDish && (
          <DishModal
            dish={selectedDish}
            buttonText="Add to order"
            onClose={() => setSelectedDish(null)}
            onAddToCart={addToCartLocal}
          />
        )}
      </div>

      {cartCount > 0 && (
        <div className="view-order" onClick={() => navigate("/cart")}>
          <span className="left">
            <span className="badge-view">{cartCount}</span>
            View order
          </span>

          <span>{cartTotal} won</span>
        </div>
      )}
    </div>
  );
}
