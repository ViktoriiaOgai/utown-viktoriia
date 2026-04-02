import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import MainLayout from "@/components/MainLayout";
import EstablishmentCardModal from "./establishments/EstablishmentCardModal";
import DeleteEstablishmentModal from "./establishments/DeleteEstablishmentModal";
import { api } from "@/services/api";
import type { Establishment, PageResponse } from "@/types/establishment";
import { asArray, getPageTotalPages, normalizeEstablishment } from "@/utils/establishments";
import "@/pages/admin/establishments.scss";

export default function EstablishmentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_navigate] = [null];

  const [rows, setRows] = useState<Establishment[]>([]);

  const [_search] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(9);
  const [selected, setSelected] = useState<Establishment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [_action] = useState("Choose action");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_filter] = useState("Filter");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_pageError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_detailsError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_deleteError] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openEstablishment = (e: Establishment) => {
    setSelected(e);
    setIsModalOpen(true);

    api
      .get(`/admin/restaurants/${e.id}`)
      .then((r: PageResponse) => {
        const data = r.data;

        const detailsSource =
          asArray(data).find(
            (x: Establishment | Partial<Establishment>) =>
              Number(x?.id ?? x?.restaurantId) === Number(e.id)
          ) ??
          data?.data ??
          data;

        if (detailsSource) {
          setSelected((prev) => normalizeEstablishment({ ...(prev ?? e), ...detailsSource }));
        }
      })
      .catch(() => {});
  };

  const closeEstablishment = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      if (!mounted) return;

      try {
        const data = await api.get(`/admin/restaurants?page=${page - 1}&size=${pageSize}`, {
          signal: controller.signal,
        });

        if (mounted) {
          setRows(asArray(data).map(normalizeEstablishment));
          setTotalPages(getPageTotalPages(data));
        }
      } catch {
        if (mounted) {
          setRows([]);
          setTotalPages(1);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [page, pageSize]);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (page > totalPages && totalPages > 0) setPage(totalPages);

    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const filtered = useMemo(() => {
    const q = _search?.trim().toLowerCase() ?? "";
    if (!q) return rows;
    return rows.filter((r) => (r.name || "").toLowerCase().includes(q));
  }, [rows, _search]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pagesToShow = useMemo(() => {
    const tp = totalPages;
    const maxButtons = 10;

    if (tp <= maxButtons) {
      return Array.from({ length: tp }, (_, i) => i + 1);
    }

    const half = Math.floor(maxButtons / 2);
    let start = page - half;
    let end = start + maxButtons - 1;

    if (start < 1) {
      start = 1;
      end = maxButtons;
    }

    if (end > tp) {
      end = tp;
      start = tp - maxButtons + 1;
    }

    return Array.from({ length: maxButtons }, (_, i) => start + i);
  }, [page, totalPages]);

  const allChecked = filtered.length > 0 && filtered.every((item) => selectedIds.includes(item.id));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds((prev) => prev.filter((id) => !filtered.some((item) => item.id === id)));
      return;
    }

    setSelectedIds((prev) => {
      const next = [...prev];

      filtered.forEach((item) => {
        if (!next.includes(item.id)) next.push(item.id);
      });

      return next;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleApply = async () => {
    if (_action !== "Delete") return;
    if (selectedIds.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const idsToDelete = [...selectedIds];

    try {
      await Promise.all(idsToDelete.map((id) => api.delete(`/admin/restaurants/${id}`)));

      setRows((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));

      setSelectedIds([]);
      setIsDeleteModalOpen(false);

      if (selected && idsToDelete.includes(selected.id)) {
        closeEstablishment();
      }
    } catch {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="establishments">
        <EstablishmentCardModal
          open={isModalOpen}
          establishment={selected}
          onClose={closeEstablishment}
        />

        <DeleteEstablishmentModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </MainLayout>
  );
}
