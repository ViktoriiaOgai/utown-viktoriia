// components/UI/CategoriesCards.tsx
import { useEffect, useState } from "react";
import {
  getCategoriesByRestaurant,
  getDishesByRestaurantAndCategory,
} from "@/services/restaurantService";
import placeholder from "@/assets/images/Ad 1.svg";
import "@/components/UI/CategoriesCards.css";

type Props = {
  variant?: "scroll" | "grid";
  restaurantId: number;
  selectedCategory: number | null;
  onSelectCategory: (id: number) => void;
};

type CategoryFromApi = {
  id: number;
  name: string;
};

type CategoryItem = {
  id: number;
  name: string;
  count: number;
};

export default function CategoryTabs({
  variant = "scroll",
  restaurantId,
  selectedCategory,
  onSelectCategory,
}: Props) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    async function load() {
      const response = await getCategoriesByRestaurant(restaurantId);
      const categories: CategoryFromApi[] = response.content;

      const dishesByCategory = await Promise.all(
        categories.map(async (c) => {
          const dishes = await getDishesByRestaurantAndCategory(restaurantId, c.id);

          return {
            categoryId: c.id,
            count: dishes.length,
          };
        })
      );

      const categoriesWithCount = categories.map((c) => {
        const found = dishesByCategory.find((x) => x.categoryId === c.id);

        return {
          id: c.id,
          name: c.name,
          count: found?.count ?? 0,
        };
      });

      setCategories(categoriesWithCount);
    }

    load();
  }, [restaurantId]);

  return (
    <div className="categories-section">
      <div className="categories-header">
        <h2>Categories</h2>
      </div>

      <div className={`categories-cards-container ${variant === "grid" ? "vertical" : ""}`}>
        {categories.length === 0 ? (
          <p style={{ padding: "10px", color: "#999" }}>No categories</p>
        ) : (
          categories.map((c) => (
            <div
              className={`categories-card ${selectedCategory === c.id ? "active" : ""}`}
              key={c.id}
              onClick={() => onSelectCategory?.(c.id)}
            >
              <img src={placeholder} alt={c.name} />

              <div className="text-block">
                <h4 className="title">{c.name}</h4>
                <p className="categ">{c.count} items</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
