/* eslint-disable @typescript-eslint/no-explicit-any */
import MainLayout from "@/components/MainLayout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/services/api";
import "./positions.scss";

type CategoryItem = { id: number; name: string };
type PositionOption = { id?: number; name: string; price: string };

function asArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.result)) return value.result;
  return [];
}

export default function EditPositionPage() {
  const navigate = useNavigate();
  const { id, positionId } = useParams();
  const establishmentId = id ?? "";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [putOnHold, setPutOnHold] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
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

    if (!positionId) return;

    api
      .get(`/admin/dishes/${positionId}`)
      .then((res) => {
        const details = res.data?.data ?? res.data;
        setName(String(details?.name ?? details?.title ?? ""));
        setDescription(String(details?.description ?? details?.about ?? ""));
        setPrice(String(details?.price ?? details?.amount ?? ""));
        setCategory(String(details?.category ?? details?.categoryName ?? ""));
        setPriority(String(details?.priority ?? details?.sortOrder ?? ""));
        setPutOnHold(Boolean(details?.putOnHold ?? details?.onHold ?? false));
      })
      .catch(() => {});

    api
      .get(`/admin/dishes/${positionId}/options`)
      .then((res) => {
        const list = asArray(res.data);
        const nextOptions: PositionOption[] = list.map((option: any) => ({
          id: Number(option?.id ?? option?.optionId ?? 0),
          name: String(option?.name ?? option?.title ?? ""),
          price: String(option?.price ?? option?.amount ?? ""),
        }));
        setOptions(nextOptions);
      })
      .catch(() => {});
  }, [positionId]);

  const selectedCategoryId = useMemo(
    () => categories.find((item) => item.name === category)?.id,
    [categories, category]
  );

  const handleOptionChange = (index: number, key: "name" | "price", value: string) => {
    setOptions((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    );
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { name: "", price: "" }]);
  };

  const handleSave = async () => {
    if (!positionId) {
      alert("Position id not found");
      return;
    }
    setIsSaving(true);
    try {
      await api.put(`/admin/dishes/${positionId}`, {
        id: Number(positionId),
        restaurantId: Number(establishmentId),
        name,
        description,
        price,
        amount: price,
        category,
        categoryId: selectedCategoryId,
        priority: Number(priority),
        sortOrder: Number(priority),
        putOnHold,
        onHold: putOnHold,
        isOnHold: putOnHold,
        blocked: putOnHold,
      });
      await Promise.all(
        options
          .filter((item) => item.name.trim() || item.price.trim())
          .map((item) => {
            if (item.id)
              return api
                .put(`/admin/dishes/${positionId}/options/${item.id}`, {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  amount: item.price,
                })
                .catch(() => null);
            return api
              .post(`/admin/dishes/${positionId}/options`, {
                name: item.name,
                price: item.price,
                amount: item.price,
              })
              .catch(() => null);
          })
      );
      navigate(`/admin/establishments/${String(establishmentId)}/positions`);
    } catch (err) {
      console.error(err);
      alert("Failed to save position");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="position-form">
        <div className="position-form__inner">
          <div className="position-form__title">Edit Position</div>
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
              onClick={() => navigate(`/admin/establishments/${String(establishmentId)}/positions`)}
            >
              Positions
            </span>
            <span className="position-form__breadcrumb-sep">/</span>
            <span>Edit</span>
          </div>
          <div className="position-form__card">
            <div className="position-form__preview">
              <div className="position-form__preview-icon">🖼</div>
              <div className="position-form__preview-bg" />
            </div>
            <div className="position-form__fields">
              <div>
                <div className="position-form__label">Position Name</div>
                <input
                  className="position-form__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <div className="position-form__label">Description</div>
                <textarea
                  className="position-form__textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <div className="position-form__label">Price</div>
                <input
                  className="position-form__input"
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
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>
              <div>
                <div className="position-form__label">Options</div>
                <div className="position-form__options">
                  {options.map((item, index) => (
                    <div key={index} className="position-form__options-row">
                      <input
                        className="position-form__options-input"
                        value={item.name}
                        onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                        placeholder="Option name"
                      />
                      <input
                        className="position-form__options-input"
                        value={item.price}
                        onChange={(e) => handleOptionChange(index, "price", e.target.value)}
                        placeholder="Price"
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
              onClick={() => navigate(`/admin/establishments/${String(establishmentId)}/positions`)}
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
