/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import MainLayout from '@/components/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './categories.scss'

type CategoryRow = {
  id: number;
  name: string;
  priority: number;
  establishmentId?: number;
};

function asArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.result)) return value.result;
  return [];
}

function normalizeCategory(item: any): CategoryRow {
  return {
    id: Number(item?.id ?? item?.categoryId ?? item?.category_id ?? 0),
    name: String(item?.name ?? item?.title ?? '—'),
    priority: Number(item?.priority ?? item?.sortOrder ?? 1),
    establishmentId: Number(
      item?.restaurantId ?? item?.establishmentId ?? item?.restaurant_id ?? 0,
    ),
  };
}

export default function EstablishmentCategoriesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const establishmentId = id ?? "";
  const pageSize = 6;

  const [allItems, setAllItems] = useState<CategoryRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("Choose action");
  const [hoverAddPos, setHoverAddPos] = useState(false);
  const [hoverAddCat, setHoverAddCat] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    axios.get('/admin/categories')
      .then((res) => {
        const data = res.data;
        const list = asArray(data).map(normalizeCategory)
        setAllItems(
          list.filter(
            (item) =>
              !item.establishmentId ||
              String(item.establishmentId) === String(establishmentId)
          )
        )
      })
      .catch(() => {
        setAllItems([]);
      });
  }, [establishmentId]);

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return allItems;
    return allItems.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
  }, [allItems, search]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredItems.length / pageSize)),
    [filteredItems.length],
  );

  const pageItems = useMemo(
    () =>
      filteredItems.slice(
        (page - 1) * pageSize,
        page * pageSize
      ),
    [filteredItems, page],
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const goTo = (p: number) =>
    setPage(Math.min(Math.max(1, p), totalPages));

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const buttonBase: React.CSSProperties = {
    padding: '8px 12px',
    border: 'none',
    background: '#fff',
    color: '#111',
    cursor: 'pointer',
  };

  const allChecked =
    pageItems.length > 0 &&
    pageItems.every((item) =>
      selectedIds.includes(item.id)
    );

  const toggleOne = (categoryId: number) =>
    setSelectedIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) =>
            !pageItems.some((item) => item.id === id)
        )
      );
      return;
    }
    setSelectedIds((prev) => {
      const next = [...prev];
      pageItems.forEach((item) => {
        if (!next.includes(item.id)) next.push(item.id);
      });
      return next;
    });
  };

  const handlePriorityChange = (
    categoryId: number,
    value: string
  ) =>
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === categoryId
          ? { ...item, priority: Number(value || 0) }
          : item
      )
    );

  const handlePrioritySave = async (
    item: CategoryRow
  ) => {
    setSavingId(item.id);
    try {
      await axios.put(`/admin/categories/${item.id}`, {
        id: item.id,
        name: item.name,
        priority: item.priority,
        sortOrder: item.priority,
        restaurantId: Number(establishmentId),
      });
    } catch (err) {
      console.error(err);
      alert('Failed to save category priority');
    } finally {
      setSavingId(null);
    }
  };

  const handleEdit = async (item: CategoryRow) => {
    const nextName = window.prompt(
      "Edit category name",
      item.name
    );
    if (nextName === null || !nextName.trim()) return;

    setSavingId(item.id);

    try {
      await axios.put(`/admin/categories/${item.id}`, {
        id: item.id,
        name: nextName.trim(),
        priority: item.priority,
        sortOrder: item.priority,
        restaurantId: Number(establishmentId),
      });

      setAllItems((prev) =>
        prev.map((category) =>
          category.id === item.id
            ? { ...category, name: nextName.trim() }
            : category
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to save category');
    } finally {
      setSavingId(null);
    }
  };

  const handleApply = async () => {
    if (action !== "Delete" || selectedIds.length === 0) return;

    try {
      await Promise.all(
        selectedIds.map((categoryId) =>
          axios
            .delete(`/admin/categories/${categoryId}`)
            .catch(() => null)
        )
      );

      setAllItems((prev) =>
        prev.filter(
          (item) => !selectedIds.includes(item.id)
        )
      );

      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert('Failed to delete categories');
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: 34, paddingTop: 28, background: '#fff', minHeight: '100%' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 44, fontWeight: 800 }}>Categories</div>

              <button type="button" onClick={() => navigate(`/admin/establishments/${establishmentId}/positions/add`)}>
                Add position
              </button>

              <button type="button" onClick={() => navigate(`/admin/establishments/${establishmentId}/positions/categories/add`)}>
                Add category
              </button>
            </div>

            <input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}