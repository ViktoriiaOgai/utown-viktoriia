/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [name, setName] = useState("Name");
  const [description, setDescription] = useState(
    "Beef, zucchini, celery, cheese, pepper, cheese edges, etc."
  );
  const [price, setPrice] = useState("7,000");
  const [category, setCategory] = useState("Select Category");
  const [priority, setPriority] = useState("1");
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
        setName(String(details?.name ?? details?.title ?? "Name"));
        setDescription(String(details?.description ?? details?.about ?? ""));
        setPrice(String(details?.price ?? details?.amount ?? "7,000"));
        setCategory(String(details?.category ?? details?.categoryName ?? "Select Category"));
        setPriority(String(details?.priority ?? details?.sortOrder ?? "1"));
        setPutOnHold(Boolean(details?.putOnHold ?? details?.onHold ?? false));
      })
      .catch(() => {});

    api
      .get(`/admin/dishes/${positionId}/options`)
      .then((res) => {
        const list = asArray(res.data);

        const nextOptions: PositionOption[] =
          list.length > 0
            ? list.map((option: any) => ({
                id: Number(option?.id ?? option?.optionId ?? 0),
                name: String(option?.name ?? option?.title ?? ""),
                price: String(option?.price ?? option?.amount ?? ""),
              }))
            : Array.from({ length: 7 }, (_, index) => ({
                name: `Option ${index + 1}`,
                price: "",
              }));

        setOptions(nextOptions);
      })
      .catch(() => {
        setOptions(
          Array.from({ length: 7 }, (_, index) => ({
            name: `Option ${index + 1}`,
            price: "",
          }))
        );
      });
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
        </div>
      </div>
    </MainLayout>
  );
}
