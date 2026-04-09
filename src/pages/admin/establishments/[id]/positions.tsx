/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/services/api";
import "./positions.scss";

type Position = {
  id: number;
  name: string;
  priority: number;
  price: string;
  category: string;
  putOnHold: boolean;
  description: string;
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

function getPageTotalPages(value: any) {
  return Math.max(
    1,
    Number(value?.totalPages ?? value?.data?.totalPages ?? value?.pages ?? value?.data?.pages ?? 1)
  );
}

function normalizePosition(item: any): Position {
  return {
    id: Number(item?.id ?? item?.dishId ?? item?.dish_id ?? 0),
    name: String(item?.name ?? item?.title ?? ""),
    priority: Number(item?.priority ?? item?.sortOrder ?? 1),
    price: String(item?.price ?? item?.amount ?? "0"),
    category: String(
      item?.category ?? item?.categoryName ?? item?.dishCategory ?? item?.type ?? ""
    ),
    putOnHold: Boolean(item?.putOnHold ?? item?.onHold ?? item?.isOnHold ?? item?.blocked ?? false),
    description: String(item?.description ?? item?.about ?? ""),
    establishmentId: Number(
      item?.restaurantId ?? item?.establishmentId ?? item?.restaurant_id ?? 0
    ),
  };
}

export default function EstablishmentPositionsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const establishmentId = id ?? "";
  const pageSize = 6;
  const [rows, setRows] = useState<Position[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [action, setAction] = useState("Choose action");
  const [hoverAddPos, setHoverAddPos] = useState(false);
  const [hoverAddCat, setHoverAddCat] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get(`/admin/dishes?page=${page - 1}&size=${pageSize}`, {
        signal: controller.signal,
      })
      .then((res) => {
        const all = asArray(res.data).map(normalizePosition);
        const filtered = all.filter((item) => {
          if (!item.establishmentId) return true;
          return String(item.establishmentId) === String(establishmentId);
        });
        setRows(filtered);
        setTotalPages(getPageTotalPages(res.data));
      })
      .catch(() => {
        setRows([]);
        setTotalPages(1);
      });
    return () => controller.abort();
  }, [page, pageSize, establishmentId]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;
  const allChecked =
    filteredRows.length > 0 && filteredRows.every((item) => selectedIds.includes(item.id));

  const toggleOne = (positionId: number) => {
    setSelectedIds((prev) =>
      prev.includes(positionId) ? prev.filter((id) => id !== positionId) : [...prev, positionId]
    );
  };

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds((prev) => prev.filter((id) => !filteredRows.some((item) => item.id === id)));
      return;
    }
    setSelectedIds((prev) => {
      const next = [...prev];
      filteredRows.forEach((item) => {
        if (!next.includes(item.id)) next.push(item.id);
      });
      return next;
    });
  };

  const handleApply = async () => {
    if (action !== "Delete") return;
    if (selectedIds.length === 0) return;
    await Promise.all(
      selectedIds.map((positionId) => api.delete(`/admin/dishes/${positionId}`).catch(() => null))
    );
    setRows((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  return (
    <MainLayout>
      <div className="positions">
        <div className="positions__inner">
          <div className="positions__header">
            <div className="positions__header-left">
              <div className="positions__title">Positions</div>
              <button
                type="button"
                className={`positions__add-btn${hoverAddPos ? " positions__add-btn--active" : ""}`}
                onClick={() => {
                  if (!establishmentId) return;
                  navigate(`/admin/establishments/${String(establishmentId)}/positions/add`);
                }}
                onMouseEnter={() => setHoverAddPos(true)}
                onMouseLeave={() => setHoverAddPos(false)}
              >
                <span>+</span> Add position
              </button>
              <button
                type="button"
                className={`positions__add-btn${hoverAddCat ? " positions__add-btn--active" : ""}`}
                onClick={() => {
                  if (!establishmentId) return;
                  navigate(
                    `/admin/establishments/${String(establishmentId)}/positions/categories/add`
                  );
                }}
                onMouseEnter={() => setHoverAddCat(true)}
                onMouseLeave={() => setHoverAddCat(false)}
              >
                <span>+</span> Add category
              </button>
            </div>
            <input
              className="positions__search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="positions__toolbar">
            <div className="positions__breadcrumb">
              <span className="positions__breadcrumb-link" onClick={() => navigate("/admin/home")}>
                Home
              </span>
              <span className="positions__breadcrumb-sep">/</span>
              <span
                className="positions__breadcrumb-link"
                onClick={() => navigate("/admin/profile")}
              >
                Users
              </span>
              <span className="positions__breadcrumb-sep">/</span>
              <span
                className="positions__breadcrumb-link"
                onClick={() => navigate("/admin/establishments")}
              >
                Establishments
              </span>
              <span className="positions__breadcrumb-sep">/</span>
              <span
                className="positions__breadcrumb-link"
                onClick={() =>
                  navigate(`/admin/establishments/${String(establishmentId)}/positions`)
                }
              >
                Positions
              </span>
            </div>
            <div className="positions__actions">
              <select className="positions__select" defaultValue="Filter">
                <option>Filter</option>
              </select>
              <select
                className="positions__select"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option>Choose action</option>
                <option>Delete</option>
              </select>
              <button type="button" className="positions__apply-btn" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>

          <div className="positions__table">
            <div className="positions__table-header">
              <div>
                <input type="checkbox" checked={allChecked} onChange={toggleAll} />
              </div>
              <div>Positions</div>
              <div>Priority</div>
              <div>Price</div>
              <div>Category</div>
              <div>Put on hold</div>
              <div>Edit</div>
              <div>Description</div>
            </div>

            {filteredRows.map((t) => (
              <div key={t.id} className="positions__table-row">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(t.id)}
                    onChange={() => toggleOne(t.id)}
                  />
                </div>
                <div>{t.name}</div>
                <div>
                  <input
                    className="positions__priority-input"
                    value={String(t.priority)}
                    readOnly
                  />
                </div>
                <div>{t.price}</div>
                <div>{t.category}</div>
                <div>
                  <div
                    className={`positions__toggle positions__toggle--${t.putOnHold ? "on" : "off"}`}
                  >
                    <div
                      className={`positions__toggle-thumb positions__toggle-thumb--${t.putOnHold ? "on" : "off"}`}
                    />
                  </div>
                </div>
                <div
                  className="positions__edit-btn"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    navigate(
                      `/admin/establishments/${String(establishmentId)}/positions/${String(t.id)}/edit`
                    );
                  }}
                >
                  Edit
                </div>
                <div className="positions__description">{t.description}</div>
              </div>
            ))}

            {filteredRows.length === 0 && (
              <div className="positions__empty">No positions found</div>
            )}
          </div>

          <div className="positions__pagination">
            <div className="positions__pagination-inner">
              <button
                type="button"
                disabled={prevDisabled}
                className={`positions__page-btn${prevDisabled ? " positions__page-btn--disabled" : ""}`}
                onClick={() => goTo(page - 1)}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goTo(p)}
                  className={`positions__page-btn${p === page ? " positions__page-btn--active" : ""}`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={nextDisabled}
                className={`positions__page-btn${nextDisabled ? " positions__page-btn--disabled" : ""}`}
                onClick={() => goTo(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
          <div className="positions__footer">Establishment id: {String(establishmentId || "")}</div>
        </div>
      </div>
    </MainLayout>
  );
}
