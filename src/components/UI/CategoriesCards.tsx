// components/UI/CategoriesCards.tsx
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import placeholder from "@/assets/images/Ad 1.svg";
import "@/components/UI/CategoriesCards.css";

type Props = {
  variant?: "scroll" | "grid";
  onSelectCategory?: (category: string | null) => void;
  selectedCategory?: string | null;
};

type Restaurant = {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
};

type CategoryItem = {
  name: string;
  count: number;
  imageUrl: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function CategoriesCards({
  variant = "scroll",
  onSelectCategory,
  selectedCategory,
}: Props) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get(`${API_URL}/public/restaurants`);

        const data = res.data.content || res.data;
        console.log("RESTAURANTS:", data);

        //группировка по категориям
        const map: Record<string, CategoryItem> = {};

        data.forEach((r: Restaurant) => {
          const key = r.category || "Other";

          if (!map[key]) {
            map[key] = {
              name: key,
              count: 0,
              imageUrl: r.imageUrl,
            };
          }

          map[key].count += 1;
        });

        setCategories(Object.values(map));
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="categories-section">
      <div className="categories-header">
        <h2>Categories</h2>
      </div>

      <div className={`categories-cards-container ${variant === "grid" ? "vertical" : ""}`}>
        {categories.map((c) => (
          <div
            className={`categories-card ${selectedCategory === c.name ? "active" : ""}`}
            key={c.name}
            onClick={() => onSelectCategory?.(selectedCategory === c.name ? null : c.name)}
          >
            <img
              src={c.imageUrl || placeholder}
              alt={c.name}
              onError={(e) => (e.currentTarget.src = placeholder)}
            />

            <div className="overlay">
              <h4 className="title">{c.name}</h4>
              <p className="categ">{c.count} places</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
