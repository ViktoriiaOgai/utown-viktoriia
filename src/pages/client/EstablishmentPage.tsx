import EstablishmentHeader from "@/components/UI/EstablishmentHeader";
import CategoryTabs from "@/components/UI/CategoryTabs";
import MenuSection from "@/components/UI/MenuSection";
import MobileHeader from "@/components/UI/Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import "@/pages/client/EstablishmentPage.css";
import Search from "@/components/UI/Search";
import Icon from "@/assets/icons/search-normal.svg";
import type { CartItem, Dish } from "@/types/cart";
import DishModal from "@/components/UI/DishModal";

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
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const getTotal = (cart: CartItem[]) =>
    cart.reduce(
      (sum, item) => sum + (item.dish.price + (item.option?.price ?? 0)) * item.quantity,
      0
    );
  const getCount = (cart: CartItem[]) => cart.reduce((sum, item) => sum + item.quantity, 0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  useEffect(() => {
    api.get(`/public/restaurants/${id}`).then((res) => {
      setRestaurant(res.data);
    });
  }, [id]);
  return (
    <>
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
            disableNavigation={true}
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
              onAddToCart={(item) => setCart((prev) => [...prev, item])}
            />
          )}
          {selectedDish && (
            <DishModal
              dish={selectedDish}
              buttonText="Add to order"
              onClose={() => setSelectedDish(null)}
              onAddToCart={(item) => {
                setCart((prev) => [...prev, item]);
              }}
            />
          )}
        </div>
        {cart.length > 0 && (
          <div className="view-order">
            <span className="left">
              <span className="badge-view">{getCount(cart)}</span>
              View order
            </span>

            <span>{getTotal(cart)} won</span>
          </div>
        )}
      </div>
    </>
  );
}
