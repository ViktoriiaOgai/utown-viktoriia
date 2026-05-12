/* eslint-disable @typescript-eslint/no-explicit-any */
import MainLayout from "@/components/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import "./positions.scss";

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

export default function EstablishmentPositionAddPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [putOnHold, setPutOnHold] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [options, setOptions] = useState<PositionOption[]>([]);

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

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { name: "", price: "" }]);
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
        title: name.trim(),
        description: description.trim(),
        price: Number(price) || 0,
        sort: Number(priority) || 0,
        restaurantId: Number(id ?? 0),
        dishCategoryId: selectedCategory?.id ?? 0,
      });
      const createdDish = res.data;
      const createdDishId = createdDish?.id ?? createdDish?.dishId ?? createdDish?.data?.id ?? null;
      if (createdDishId) {
        await Promise.all(
          options
            .filter((item) => item.name.trim() || item.price.trim())
            .map((item) =>
              api
                .post(`/admin/dishes/${createdDishId}/options`, {
                  name: item.name,
                  price: item.price,
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
      <div className="position-form">
        <div className="position-form__inner">
          <div className="position-form__title">Add Position</div>
          <div className="position-form__breadcrumb">
            <span
              className="position-form__breadcrumb-link"
              onClick={() => navigate("/admin/home")}
            >
              Home
            </span>
            <span className="position-form__breadcrumb-sep">/</span>
            <span
              className="position-form__breadcrumb-link"
              onClick={() => navigate("/admin/profile")}
            >
              Users
            </span>
            <span className="position-form__breadcrumb-sep">/</span>
            <span
              className="position-form__breadcrumb-link"
              onClick={() => navigate("/admin/establishments")}
            >
              Establishments
            </span>
            <span className="position-form__breadcrumb-sep">/</span>
            <span
              className="position-form__breadcrumb-link"
              onClick={() => navigate(`/admin/establishments/${String(id || "")}/positions`)}
            >
              Positions
            </span>
            <span className="position-form__breadcrumb-sep">/</span>
            <span>Add</span>
          </div>
          <div className="position-form__card">
            <div className="position-form__preview">
              <div className="position-form__preview-icon">🍽</div>
              <div className="position-form__preview-bg" />
            </div>
            <div className="position-form__fields">
              <div>
                <div className="position-form__label">Position Name</div>
                <input
                  className="position-form__input"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <div className="position-form__label">Description</div>
                <textarea
                  className="position-form__textarea"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <div className="position-form__label">Price</div>
                <input
                  className="position-form__input"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <div className="position-form__label">Category</div>
                <select
                  className="position-form__select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="position-form__label">Priority</div>
                <input
                  className="position-form__input"
                  placeholder="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>
              <div>
                <div className="position-form__label">Options</div>
                <div className="position-form__options">
                  {options.map((option, index) => (
                    <div key={index} className="position-form__options-row">
                      <input
                        className="position-form__options-input"
                        placeholder={`Option ${index + 1}`}
                        value={option.name}
                        onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                      />
                      <input
                        className="position-form__options-input"
                        placeholder="Price"
                        value={option.price}
                        onChange={(e) => handleOptionChange(index, "price", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddOption}
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    cursor: "pointer",
                    background: "none",
                    border: "1px solid #cbd5e1",
                    borderRadius: 4,
                    padding: "4px 12px",
                  }}
                >
                  + Add option
                </button>
              </div>
              <div className="position-form__hold">
                <div className="position-form__hold-title">Put on Hold</div>
                <button
                  type="button"
                  className={`position-form__toggle position-form__toggle--${putOnHold ? "on" : "off"}`}
                  onClick={() => setPutOnHold((v) => !v)}
                >
                  <span
                    className={`position-form__toggle-thumb position-form__toggle-thumb--${putOnHold ? "on" : "off"}`}
                  />
                </button>
              </div>
              <div className="position-form__hold-desc">
                The dish remains on the menu
                <br />
                but is unavailable for order.
              </div>
            </div>
          </div>
          <div className="position-form__actions">
            <button
              type="button"
              className="position-form__btn position-form__btn--cancel"
              onClick={() => navigate(`/admin/establishments/${String(id || "")}/positions`)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="position-form__btn position-form__btn--submit"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
