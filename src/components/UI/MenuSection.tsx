import { useEffect, useState } from "react";
import { getDishesByRestaurant } from "@/services/restaurantService";
import DishCard from "./DishCard";
import "@/components/UI/MenuSection.css";
import { useMemo } from "react";
import DishModal from "./DishModal";

type Dish = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  restaurantId: number;
  dishCategoryId: number;
  categoryName: string;
  buttonText: string;
};

type Props = {
  restaurantId: number;
  search: string;
  selectedCategory: number | null;
};

export default function MenuSection({ restaurantId, search, selectedCategory }: Props) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const grouped = useMemo(() => {
    const q = (search || "").toLowerCase().trim();

    const filtered = dishes.filter((d) => {
      const matchSearch = q === "" || (d.title || "").toLowerCase().includes(q);

      const matchCategory =
        selectedCategory === null ? true : d.dishCategoryId === selectedCategory;

      return matchSearch && matchCategory;
    });

    return filtered.reduce(
      (acc, dish) => {
        const key = dish.categoryName || "Other";

        if (!acc[key]) acc[key] = [];
        acc[key].push(dish);

        return acc;
      },
      {} as Record<string, Dish[]>
    );
  }, [dishes, search, selectedCategory]);

  useEffect(() => {
    getDishesByRestaurant(restaurantId).then((res) => {
      setDishes(Array.isArray(res) ? res : (res?.content ?? []));
    });
  }, [restaurantId]);

  return (
    <div className="menu-section">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="menu-category">
          <h3 className="menu-title">{category}</h3>

          {items.map((dish) => (
            <DishCard key={dish.id} dish={dish} onClick={() => setSelectedDish(dish)} />
          ))}
        </div>
      ))}
      {selectedDish && (
        <DishModal
          dish={selectedDish}
          buttonText="Add to order"
          onClose={() => setSelectedDish(null)}
          onAddToCart={(dish, qty) => {
            console.log("ADD:", dish, qty);
          }}
        />
      )}
    </div>
  );
}
