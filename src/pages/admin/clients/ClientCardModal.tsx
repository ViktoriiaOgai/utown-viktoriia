import type { Client } from "../clients";

type Props = {
  open: boolean;
  client: Client | null;
  onClose: () => void;
  onEdit: () => void;
};

export default function ClientCardModal({ open, client, onClose, onEdit }: Props) {
  if (!open || !client) return null;

  const avatar = client.avatarUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "min(726px, 100%)",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          position: "relative",
          padding: "44px 52px 56px",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 18,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 32,
            lineHeight: 1,
            color: "#98a2b3",
            padding: 0,
          }}
        >
          ✕
        </button>

        <div
          style={{
            display: "flex",
            gap: 0,
            width: "100%",
            height: 174,
            marginBottom: 22,
            background: "#f3f3f3",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 176,
              height: "100%",
              overflow: "hidden",
              background: "#e5e7eb",
              flex: "0 0 auto",
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={client.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 56,
                  fontWeight: 800,
                  color: "#374151",
                  background: "#f3f4f6",
                }}
              >
                {(client.name || "C").trim().charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div
            style={{
              flex: 1,
              position: "relative",
              background: "#f3f3f3",
            }}
          >
            <button
              type="button"
              onClick={onEdit}
              style={{
                position: "absolute",
                top: 22,
                right: 20,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 18,
                height: 40,
                padding: "0 16px",
                border: "none",
                borderRadius: 4,
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                color: "#374151",
                minWidth: 204,
                boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
              }}
            >
              <span>Edit account</span>
              <span style={{ fontSize: 18, lineHeight: 1 }}>›</span>
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 224px",
            columnGap: 56,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#1f2937",
                marginBottom: 0,
                lineHeight: 1.35,
              }}
            >
              {client.name}
            </div>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>
                Phone:
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#6b7280", lineHeight: 1.45 }}>
                {client.phone || "—"}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>
                City:
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#6b7280", lineHeight: 1.45 }}>
                {client.city || "—"}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>
                Address:
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#6b7280",
                  lineHeight: 1.45,
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                }}
              >
                {client.address || "—"}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>
                Orders:
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#6b7280", lineHeight: 1.45 }}>
                {client.orders} orders
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
