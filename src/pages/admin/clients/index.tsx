import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/MainLayout";
import { api } from "../../../services/api";
import ClientCardModal from "./ClientCardModal";

export type Client = {
  id: number;
  name: string;
  phone: string;
  address: string;
  city?: string;
  avatarUrl?: string;
  orders: number;
};

export default function ClientsPage() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);

      try {
        const res = await api.get("/admin/clients");
        const data = res.data?.data ?? res.data ?? [];

        const mapped = data.map((c: unknown) => {
          const client = c as Record<string, unknown>;

          return {
            id: Number(client.id),
            name: String(client.name ?? ""),
            phone: String(client.phone ?? ""),
            address: String(client.address ?? ""),
            city: client.city as string | undefined,
            avatarUrl: client.avatarUrl as string | undefined,
            orders: Number(client.orders ?? 0),
          };
        });

        setClients(mapped);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <MainLayout>
      <div style={{ padding: "28px 34px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800 }}>Clients</h1>

        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => navigate("/admin/clients/add")}
            style={{
              height: 36,
              padding: "0 16px",
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Add client
          </button>
        </div>

        {loading ? (
          <div style={{ marginTop: 20 }}>Loading...</div>
        ) : (
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {clients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelected(client)}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 16,
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 700 }}>{client.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{client.phone}</div>
              </div>
            ))}
          </div>
        )}

        <ClientCardModal
          open={!!selected}
          client={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            if (selected) {
              navigate(`/admin/clients/${selected.id}/edit`);
            }
          }}
        />
      </div>
    </MainLayout>
  );
}
