import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/MainLayout";
import { api } from "../../services/api";
import { getErrorMessage } from "../../utils/establishments";
import ClientCardModal from "./clients/ClientCardModal";
import DeleteClientModal from "./clients/DeleteClientModal";

export type Client = {
  id: number;
  name: string;
  phone: string;
  city: string;
  address: string;
  orders: number;
  avatarUrl?: string;
};

interface ClientsResponse {
  content: Client[];
  totalPages: number;
}

function normalizeClient(item: unknown): Client {
  const i = item as Record<string, unknown>;
  const address = i?.address as Record<string, unknown>;
  return {
    id: Number(i?.id ?? 0),
    name: String(i?.name ?? i?.username ?? i?.fullName ?? i?.firstName ?? "?"),
    phone: String(i?.phone ?? i?.phoneNumber ?? i?.username ?? "?"),
    city: String(i?.city ?? address?.city ?? "?"),
    address: String(i?.fullAddress ?? address?.fullAddress ?? address?.details ?? "?"),
    orders: Number(i?.ordersCount ?? i?.orders ?? 0),
    avatarUrl: i?.avatarUrl ? String(i.avatarUrl) : undefined,
  };
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [action, setAction] = useState("Choose action");
  const [filter, setFilter] = useState("Filter");
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const pageSize = 9;

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    api
      .get<ClientsResponse>(`/admin/clients?page=${page - 1}&size=${pageSize}&search=${search}`, {
        signal: controller.signal,
      })
      .then((response) => {
        if (cancelled) return;

        setIsLoading(false);
        setPageError("");
        setRows(response.data.content.map(normalizeClient));
        setTotalPages(Math.max(1, response.data.totalPages));
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setIsLoading(false);
        setRows([]);
        setPageError(getErrorMessage(error, "Failed to load clients"));
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [page, search]);

  const allChecked = rows.length > 0 && rows.every((c) => selectedIds.includes(c.id));

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds((prev) => prev.filter((id) => !rows.some((c) => c.id === id)));
    } else {
      setSelectedIds((prev) => {
        const next = [...prev];
        rows.forEach((c) => {
          if (!next.includes(c.id)) next.push(c.id);
        });
        return next;
      });
    }
  };

  const handleApply = () => {
    setDeleteError("");
    if (action !== "Delete") return;
    if (selectedIds.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const idsToDelete = [...selectedIds];
    setDeleteError("");
    try {
      await Promise.all(idsToDelete.map((id) => api.delete(`/admin/clients/${id}`)));
      setRows((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
      setSelectedIds([]);
      setIsDeleteModalOpen(false);
    } catch (error: unknown) {
      setDeleteError(getErrorMessage(error, "Failed to delete clients"));
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="establishments">
        <div className="establishmentsTop">
          <div className="establishmentsTitleBlock">
            <h1 className="establishmentsTitle">Clients</h1>
            <div className="establishmentsCrumbs">
              <span className="crumbLink" onClick={() => navigate("/admin/home")}>
                Home
              </span>
              <span className="crumbSep">/</span>
              <span className="crumbLink" onClick={() => navigate("/admin/profile")}>
                Users
              </span>
              <span className="crumbSep">/</span>
              <span className="crumbCurrent">Clients</span>
            </div>
          </div>

          <div className="establishmentsControls">
            <div className="searchBox">
              <input
                className="searchInput"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="controlsRow">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="selectReal"
              >
                <option>Filter</option>
                <option>Name</option>
                <option>City</option>
              </select>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="selectReal"
              >
                <option>Choose action</option>
                <option>Delete</option>
                <option>Export</option>
              </select>
              <button className="applyBtn" type="button" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        </div>

        {pageError && <div className="pageMessage pageMessageError">{pageError}</div>}
        {deleteError && <div className="pageMessage pageMessageError">{deleteError}</div>}

        {isLoading ? (
          <div className="loadingState">Loading...</div>
        ) : (
          <>
            <div className="tableWrap">
              <table className="table">
                <colgroup>
                  <col style={{ width: "52px" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "56px" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="th checkboxCol">
                      <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                    </th>
                    <th className="th">Name</th>
                    <th className="th">Number</th>
                    <th className="th">City</th>
                    <th className="th">Address</th>
                    <th className="th">Orders</th>
                    <th className="th">Order History</th>
                    <th className="th iconCol" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr
                      key={c.id}
                      className="tr"
                      onClick={() => {
                        setSelected(c);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="td checkboxCol" onClick={(ev) => ev.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(c.id)}
                          onChange={() => toggleOne(c.id)}
                        />
                      </td>
                      <td className="td cellStrong">{c.name}</td>
                      <td className="td">{c.phone}</td>
                      <td className="td">{c.city}</td>
                      <td className="td">{c.address}</td>
                      <td className="td cellStrong">{c.orders}</td>
                      <td className="td historyTd" onClick={(ev) => ev.stopPropagation()}>
                        <span className="viewLink">View</span>
                        <span className="chev">›</span>
                      </td>
                      <td className="td iconCol" onClick={(ev) => ev.stopPropagation()}>
                        <span
                          className="eye"
                          onClick={() => {
                            setSelected(c);
                            setIsModalOpen(true);
                          }}
                        >
                          👁
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td className="td emptyRow" colSpan={8}>
                        No clients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pager">
              <button
                className="pagerBtn"
                onClick={() => {
                  setIsLoading(true);
                  setPage((p) => Math.max(1, p - 1));
                }}
                disabled={page <= 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagerBtn ${p === page ? "active" : ""}`}
                  onClick={() => {
                    setIsLoading(true);
                    setPage(p);
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                className="pagerBtn"
                onClick={() => {
                  setIsLoading(true);
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}

        <ClientCardModal
          open={isModalOpen}
          client={selected}
          onClose={() => setIsModalOpen(false)}
          onEdit={() => {
            setIsModalOpen(false);
            navigate(`/admin/clients/${selected?.id}/edit`);
          }}
        />

        <DeleteClientModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </MainLayout>
  );
}
