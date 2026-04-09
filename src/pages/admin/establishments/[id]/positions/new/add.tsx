/* eslint-disable @typescript-eslint/no-explicit-any */
import MainLayout from "@/components/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import "./add.scss";

type CategoryItem = { id: number; name: string };
type PositionOption = { name: string; price: string };

function asArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.result)) return value.result;
  return [];
}

export default function EstablishmentPositionNewAddPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [putOnHold, setPutOnHold] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("7,000");
  const [category, setCategory] = useState("Select Category");
  const [priority, setPriority] = useState("1");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [options, setOptions] = useState<PositionOption[]>(
    Array.from({ length: 7 }, (_, i) => ({
      name: `Option ${i + 1}`,
      price: "3,000",
    }))
  );

  useEffect(() => {
    api
      .get("/admin/categories")
      .then((res) => {
        const list = asArray(res.data).map((item: any) => ({
          id: Number(item?.id ?? 0),
          name: String(item?.name ?? item?.title ?? ""),
        }));
        setCategories(list);
      })
      .catch(() => {});
  }, []);

  const handleOptionChange = (index: number, key: "name" | "price", value: string) => {
    setOptions((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Enter position name");
      return;
    }
    setIsSaving(true);
    try {
      const selectedCategory = categories.find((item) => item.name === category);
      const res = await api.post("/admin/dishes", {
        restaurantId: Number(id ?? 0),
        name: name.trim(),
        description: description.trim(),
        price,
        amount: price,
        category,
        categoryId: selectedCategory?.id,
        priority: Number(priority),
        sortOrder: Number(priority),
        putOnHold,
        onHold: putOnHold,
        isOnHold: putOnHold,
        blocked: putOnHold,
      });
      const createdDish = res.data;
      const createdDishId =
        createdDish?.id ??
        createdDish?.dishId ??
        createdDish?.data?.id ??
        createdDish?.data?.dishId ??
        null;
      if (createdDishId) {
        await Promise.all(
          options
            .filter((item) => item.name.trim() || item.price.trim())
            .map((item) =>
              api
                .post(`/admin/dishes/${createdDishId}/options`, {
                  name: item.name,
                  price: item.price,
                  amount: item.price,
                })
                .catch(() => null)
            )
        );
      }
      navigate(`/admin/establishments/${String(id || "")}/positions`);
    } catch (err) {
      console.error(err);
      alert("Failed to add position");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="add-position">
        <div className="add-position__inner">
          <div className="add-position__title">Add Position</div>
          <div className="add-position__breadcrumb">
            <span className="add-position__breadcrumb-link" onClick={() => navigate("/admin/home")}>
              Home
            </span>
            <span className="add-position__breadcrumb-sep">/</span>
            <span
              className="add-position__breadcrumb-link"
              onClick={() => navigate("/admin/profile")}
            >
              Users
            </span>
            <span className="add-position__breadcrumb-sep">/</span>
            <span
              className="add-position__breadcrumb-link"
              onClick={() => navigate("/admin/establishments")}
            >
              Establishments
            </span>
            <span className="add-position__breadcrumb-sep">/</span>
            <span
              className="add-position__breadcrumb-link"
              onClick={() => navigate(`/admin/establishments/${String(id || "")}/positions`)}
            >
              Positions
            </span>
            <span className="add-position__breadcrumb-sep">/</span>
            <span>Add</span>
          </div>

          <div className="add-position__form-wrap">
            <div className="add-position__form">
              <div className="add-position__image">🖼</div>

              <div className="add-position__field">
                <div className="add-position__label">Position Name</div>
                <input
                  className="add-position__input"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="add-position__field">
                <div className="add-position__label">Description</div>
                <textarea
                  className="add-position__textarea"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="add-position__field">
                <div className="add-position__label">Price</div>
                <input
                  className="add-position__input"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="add-position__field">
                <div className="add-position__label">Category</div>
                <select
                  className="add-position__select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Select category</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="add-position__field">
                <div className="add-position__label">Priority</div>
                <input
                  className="add-position__input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>

              <div className="add-position__options">
                <div className="add-position__label">Options</div>
                {options.map((option, index) => (
                  <div key={index + 1} className="add-position__options-row">
                    <input
                      className="add-position__input"
                      placeholder={`Option ${index + 1}`}
                      value={option.name}
                      onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                    />
                    <input
                      className="add-position__input"
                      value={option.price}
                      onChange={(e) => handleOptionChange(index, "price", e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="add-position__hold">
                <div>
                  <div className="add-position__hold-title">Put on Hold</div>
                  <div className="add-position__hold-desc">
                    The dish remains on the menu
                    <br />
                    but is unavailable for order.
                  </div>
                </div>
                <button
                  type="button"
                  className={`add-position__toggle add-position__toggle--${putOnHold ? "on" : "off"}`}
                  onClick={() => setPutOnHold((v) => !v)}
                >
                  <div
                    className={`add-position__toggle-thumb add-position__toggle-thumb--${putOnHold ? "on" : "off"}`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="add-position__actions">
            <button
              type="button"
              className="add-position__btn add-position__btn--cancel"
              onClick={() => navigate(`/admin/establishments/${String(id || "")}/positions`)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="add-position__btn add-position__btn--submit"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
