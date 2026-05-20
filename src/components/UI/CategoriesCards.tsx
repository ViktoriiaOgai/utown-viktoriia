import { useMemo } from "react";
import { useRestaurantsData } from "@/hooks/useRestaurantsData";
import placeholder from "@/assets/images/Ad 1.svg";
import "@/components/UI/CategoriesCards.css";
import type { Restaurant } from "@/types/restaurant";

type Props = {
  variant?: "scroll" | "grid";
  onSelectCategory?: (category: string | null) => void;
  selectedCategory?: string | null;
};

type CategoryItem = {
  name: string;
  count: number;
  imageUrl: string;
};

export default function CategoriesCards({
  variant = "scroll",
  onSelectCategory,
  selectedCategory,
}: Props) {
  const restaurants = useRestaurantsData();

  const categories = useMemo<CategoryItem[]>(() => {
    const map: Record<string, CategoryItem> = {};

    restaurants.forEach((r: Restaurant) => {
      const key = r.category || "Other";

      if (!map[key]) {
        map[key] = {
          name: key,
          count: 0,
          imageUrl: r.imageUrl || "",
        };
      }

      map[key].count += 1;

      // берём первую нормальную картинку
      if (!map[key].imageUrl && r.imageUrl) {
        map[key].imageUrl = r.imageUrl;
      }
    });

    return Object.values(map);
  }, [restaurants]);

  return (
    <div className="categories-section">
      <div className="categories-header">
        <h2>Categories</h2>
      </div>

      <div className={`categories-cards-container ${variant === "grid" ? "vertical" : ""}`}>
        {categories.map((c) => (
          <div
            key={c.name}
            className={`categories-card ${selectedCategory === c.name ? "active" : ""}`}
            onClick={() => onSelectCategory?.(selectedCategory === c.name ? null : c.name)}
          >
            <img
              src={c.imageUrl || placeholder}
              alt={c.name}
              onError={(e) => {
                e.currentTarget.src = placeholder;
              }}
            />

            <div className="overlay">
              <h4 className="title">{c.name}</h4>
              <p className="categ">{c.count} establishments </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
