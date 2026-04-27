import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

type Dish = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
};

export default function DishPage() {
  const { id } = useParams();
  const [dish, setDish] = useState<Dish | null>(null);

  useEffect(() => {
    api.get(`/dishes/${id}`).then((res) => {
      setDish(res.data);
    });
  }, [id]);

  if (!dish) return <p>Loading...</p>;

  return (
    <div className="dish-page">
      <img src={dish.imageUrl || "/placeholder.jpg"} />

      <h2>{dish.title}</h2>
      <span>{dish.price}won</span>
      <p>{dish.description}</p>
    </div>
  );
}
