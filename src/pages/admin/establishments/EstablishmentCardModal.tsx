import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconClose } from "../../../assets/icons/EstablishmentsIcons";
import type { Establishment } from "../../../types/establishment";

type Props = {
  open: boolean;
  establishment: Establishment | null;
  onClose: () => void;
};

export default function EstablishmentCardModal({ open, establishment, onClose }: Props) {
  const navigate = useNavigate();
  const [imgBroken, setImgBroken] = useState(false);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => setImgBroken(false), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !establishment) return null;

  const logoUrl = "/establishment-logo.jpg";

  const deliveryAreasText = Array.isArray(establishment.deliveryAreas)
    ? establishment.deliveryAreas.join(", ")
    : String(establishment.deliveryAreas ?? "");

  const openingHoursText =
    typeof establishment.openingHours === "string"
      ? establishment.openingHours
      : establishment.openingHours && typeof establishment.openingHours === "object"
        ? Object.entries(establishment.openingHours)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        : "";

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
        style={{
          width: "min(920px, 100%)",
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#9ca3af",
            padding: 6,
            lineHeight: 0,
            zIndex: 2,
            borderRadius: 6,
            transition: "color 0.15s",
          }}
        >
          <IconClose />
        </button>

        <div style={{ padding: 28 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
            <div
              style={{
                width: 220,
                height: 165,
                overflow: "hidden",
                background: "#f3f4f6",
                borderRadius: 8,
                flex: "0 0 auto",
              }}
            >
              {!imgBroken ? (
                <img
                  src={logoUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={() => setImgBroken(true)}
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
                  }}
                >
                  {(establishment.name || "E").trim().charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div
              style={{
                flex: 1,
                background: "#f9fafb",
                borderRadius: 8,
                position: "relative",
                height: 165,
                paddingRight: 64,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 18,
                  display: "grid",
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/admin/establishments/${establishment.id}/edit`);
                  }}
                  style={{
                    height: 40,
                    padding: "0 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    background: "#fff",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#111827",
                    minWidth: 200,
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  <span>Edit account</span>
                  <span style={{ fontSize: 18, lineHeight: 1, color: "#6b7280" }}>›</span>
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", marginTop: 24, gap: 26 }}>
            <div style={{ width: 360 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                {establishment.name || "Establishment Name"}
              </div>

              <div style={{ height: 18 }} />

              <div style={{ display: "grid", gap: 16, color: "#4b5563", fontSize: 13 }}>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#6b7280",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    Description
                  </div>
                  <div style={{ marginTop: 4, lineHeight: 1.55, color: "#374151" }}>
                    {establishment.description || "—"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#6b7280",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    City
                  </div>
                  <div style={{ marginTop: 4, fontWeight: 600, color: "#111827" }}>
                    {establishment.city || "—"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#6b7280",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    Delivery Areas
                  </div>
                  <div style={{ marginTop: 4, lineHeight: 1.55, color: "#374151" }}>
                    {deliveryAreasText || "—"}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ width: 320, marginTop: 2 }}>
              <div style={{ display: "grid", gap: 16, color: "#4b5563" }}>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    Phone
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginTop: 4 }}>
                    {establishment.phone || "—"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    Establishment Category
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginTop: 4 }}>
                    {establishment.category || "—"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    Min. order
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginTop: 4 }}>
                    {establishment.minOrder ?? "—"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    Orders
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginTop: 4 }}>
                    {String(establishment.ordersCount ?? "") || "—"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    Opening hours
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      whiteSpace: "pre-line",
                      lineHeight: 1.55,
                      color: "#374151",
                      marginTop: 4,
                    }}
                  >
                    {openingHoursText || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 12 }} />
        </div>
      </div>
    </div>
  );
}
